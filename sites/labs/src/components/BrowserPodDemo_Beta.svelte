<script>
	import { onMount } from "svelte";
	import { svelte } from "@replit/codemirror-lang-svelte";
	import { javascript } from "@codemirror/lang-javascript";
	import { html } from "@codemirror/lang-html";
	import { css } from "@codemirror/lang-css";
	import { json } from "@codemirror/lang-json";
	import CodeMirror from "svelte-codemirror-editor";
	import { lineNumbers } from "@codemirror/view";
	import Icon from "@iconify/svelte";
	import QRCode from "qrcode";

	export let showTerminalTab = false;
	export let showReplTab = false;
	export let showPreview = false;
	export let showEditor = false;
	// Allows serializable actions to run once the pod is ready (used from MDX)
	export let readyActions = [];

	let selectedFile = "";
	let portalURL = "";
	let fileContent = "";
	let origFileContent = "";
	let loading = true;
	let showPortalInfo = false;
	let saveTimeout = null;
	let isSaving = false;
	let portalInfoTimeout = null;
	let portalInfoAutoShown = false;
	let isCompatibleBrowser = true;

	let pod;
	let mainTerminal;
	let replTerminal;
	let portalElement;
	let qrCodeCanvas;
	let qrCodeGenerated = false;
	let replStarted = false;
	let activeConsole = showTerminalTab
		? "terminal"
		: showReplTab
			? "repl"
			: null;
	$: hasTerminalPanel = showTerminalTab || showReplTab;
	$: if (!showTerminalTab && activeConsole === "terminal") {
		activeConsole = showReplTab ? "repl" : null;
	}
	$: if (!showReplTab && activeConsole === "repl") {
		activeConsole = showTerminalTab ? "terminal" : null;
	}

	let copied = false;
	let copiedTimeout;

	function isBrowserSupported() {
		return !!Atomics.waitAsync;
	}

	function queueSave() {
		showPortalInfo = false;
		showMobilePortal = false;
		clearTimeout(portalInfoTimeout);
		portalInfoAutoShown = true;
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			if (!isSaving && portalURL) {
				isSaving = true;
				saveFile().then(() => {
					isSaving = false;
				});
			}
		}, 1000);
	}

	$: if (fileContent !== origFileContent && !loading && isCompatibleBrowser) {
		queueSave();
	}

	$: extensions = (() => {
		if (selectedFile.endsWith(".svelte")) return [svelte(), lineNumbers()];
		if (selectedFile.endsWith(".js")) return [javascript(), lineNumbers()];
		if (selectedFile.endsWith(".html")) return [html(), lineNumbers()];
		if (selectedFile.endsWith(".css")) return [css(), lineNumbers()];
		if (selectedFile.endsWith(".json")) return [json(), lineNumbers()];
		return [lineNumbers()];
	})();

	const projectFiles = [
		"public/vite.svg",
		"README.md",
		".npmrc",
		"index.html",
		"svelte.config.js",
		"src/assets/svelte.svg",
		"src/main.js",
		"src/app.css",
		"src/vite-env.d.ts",
		"src/App.svelte",
		"src/lib/Counter.svelte",
		"vite.config.js",
		"jsconfig.json",
		"package.json",
		"package-lock.json",
	];

	function loadFile(fileName) {
		// Cancel any pending save before loading a new file
		clearTimeout(saveTimeout);

		loading = true;
		try {
			selectedFile = fileName;
			_readFile(fileName, (content) => {
				origFileContent = content;
				fileContent = content;
				loading = false;
			});
		} catch (error) {
			console.error(`Failed to load file: ${error}`);
			fileContent = "Error loading file.";
			loading = false;
		}
	}

	async function saveFile() {
		try {
			_writeFile(selectedFile, fileContent);
			console.log("File autosaved:", selectedFile);
			return true;
		} catch (error) {
			console.error("Failed to save file:", error);
			return false;
		}
	}

	async function _readFile(fileName, callback) {
		const fullPath = `/files/${fileName}`;
		try {
			const f = await pod.openFile(fullPath, "utf-8");
			const size = await f.getSize();
			const content = await f.read(size);
			await f.close();
			callback(content);
		} catch (e) {
			throw new Error(`Failed to read file ${fullPath}:`, e);
		}
	}

	async function _writeFile(fileName, content) {
		const fullPath = `/files/${fileName}`;
		try {
			const parts = fileName.split("/");
			parts.pop();
			const dir = parts.join("/");
			await pod.createDirectory(`/files/${dir}`, { recursive: true });
			const f = await pod.createFile(fullPath, "utf-8");
			await f.write(content);
			await f.close();
		} catch (e) {
			throw new Error(`Failed to write file ${fullPath}:`, e);
		}
	}

	onMount(async () => {
		isCompatibleBrowser = isBrowserSupported();

		if (!isCompatibleBrowser) {
			loading = false;
			return;
		}

		try {
			checkMobileView();

			// Setup resize observer
			window.addEventListener("resize", checkMobileView);

			const { BrowserPod } = await import(
				"https://rt.browserpod.io/0.9.6/browserpod.js"
			);
			pod = await BrowserPod.boot({
				apiKey:
					"bp1_74c9fd5dfa63d386d410f9dad99691d4f4a0776bff3b267e72851604d7a98c46",
			});
			const mainTerminalDiv = document.getElementById("main-console");
			const replTerminalDiv = document.getElementById("repl-console");
			if (mainTerminalDiv) {
				mainTerminal = await pod.createDefaultTerminal(mainTerminalDiv);
			}
			if (showReplTab && replTerminalDiv) {
				replTerminal = await pod.createDefaultTerminal(replTerminalDiv);
			}

			for (const file of projectFiles) {
				const content = await fetchFile(file);
				// create (sub-)folders if they don't exist
				const parts = file.split("/");
				if (parts.length > 1) {
					parts.pop();
					const dir = parts.join("/");
					await pod.createDirectory(`/files/${dir}`, { recursive: true });
				}
				const f = await pod.createFile(`/files/${file}`, "binary");
				const copy = new Uint8Array(content);
				await f.write(copy.buffer);
				await f.close();
			}

			loadFile("src/lib/Counter.svelte");

			pod.onPortal(function (data) {
				const url = data.url;
				if (portalElement) {
					portalElement.src = url;
				}
				portalURL = url;

				// Remove auto-show if user toggles manually
				clearTimeout(portalInfoTimeout);

				if (showPortalInfo && !qrCodeGenerated) {
					setTimeout(() => generateQRCode(), 0);
				}
			});

			try {
				await runReadyActions();
			} catch (callbackError) {
				console.error("onPodReady callback threw an error", callbackError);
			}
		} catch (error) {
			console.error(`Failed Initializing BrowserPod: ${error}`);
			loading = false;
		}

		return () => {
			window.removeEventListener("resize", checkMobileView);
		};
	});

	async function fetchFile(fileName) {
		const response = await fetch(`vite1/${fileName}`);
		const buffer = await response.arrayBuffer();
		return new Uint8Array(buffer);
	}

	// Run any preconfigured ready actions without needing a function prop
	async function runReadyActions() {
		if (!Array.isArray(readyActions) || !readyActions.length) return;

		for (const action of readyActions) {
			if (!action || !action.command) continue;

			const { command, args = [], terminal = "main", options = {} } = action;

			const targetTerminal =
				terminal === "repl"
					? replTerminal
					: terminal === "none"
						? null
						: mainTerminal;

			try {
				const runOptions = targetTerminal
					? { terminal: targetTerminal, ...options }
					: options;
				await pod.run(command, args, runOptions);
			} catch (err) {
				console.error("Failed to run ready action", action, err);
			}
		}
	}

	$: if (portalURL && !showPortalInfo && !portalInfoAutoShown && !isMobile) {
		clearTimeout(portalInfoTimeout);
		portalInfoTimeout = setTimeout(() => {
			showPortalInfo = true;
			portalInfoAutoShown = true;
			setTimeout(() => generateQRCode(), 0);
		}, 3000);
	}

	function togglePortalInfo() {
		showPortalInfo = !showPortalInfo;
		clearTimeout(portalInfoTimeout);
		portalInfoAutoShown = true;

		if (showPortalInfo && portalURL) {
			setTimeout(() => generateQRCode(), 0);
		}
	}

	let showMobilePortal = false;

	function toggleMobilePortal() {
		showMobilePortal = !showMobilePortal;

		if (showMobilePortal && portalURL) {
			setTimeout(() => generateQRCode(), 0);
		}
	}

	function generateQRCode() {
		if (portalURL && qrCodeCanvas) {
			QRCode.toCanvas(
				qrCodeCanvas,
				portalURL,
				{
					width: 150,
					margin: 0,
					color: {
						dark: "#000000",
						light: "#ffffff",
					},
					errorCorrectionLevel: "H",
				},
				function (error) {
					if (error) {
						console.error("Error generating QR code:", error);
					}
				}
			);
		}
	}

	let isMobile = false;

	function checkMobileView() {
		isMobile = window.innerWidth < 768;

		if (isMobile) {
			clearTimeout(portalInfoTimeout);
			portalInfoAutoShown = true;
			showPortalInfo = false;
		}
	}

	async function copyPortalURL() {
		if (portalURL) {
			await navigator.clipboard.writeText(portalURL);
			copied = true;
			clearTimeout(copiedTimeout);
			copiedTimeout = setTimeout(() => (copied = false), 1200);
		}
	}

	function handleTerminalTabClick() {
		if (!showTerminalTab) return;
		const terminalTab = document.getElementById("terminal-tab");
		const replTab = document.getElementById("repl-tab");
		const mainConsole = document.getElementById("main-console");
		const replConsole = document.getElementById("repl-console");
		terminalTab?.classList.add("active");
		replTab?.classList.remove("active");
		mainConsole?.classList.add("active");
		replConsole?.classList.remove("active");
		activeConsole = "terminal";
		mainConsole?.focus();
	}

	function handleReplTabClick() {
		if (!showReplTab || !replTerminal) return;
		const terminalTab = document.getElementById("terminal-tab");
		const replTab = document.getElementById("repl-tab");
		const mainConsole = document.getElementById("main-console");
		const replConsole = document.getElementById("repl-console");
		terminalTab?.classList.remove("active");
		replTab?.classList.add("active");
		mainConsole?.classList.remove("active");
		replConsole?.classList.add("active");
		activeConsole = "repl";
		replConsole?.focus();

		// Spawn REPL process on demand the first time the tab is selected
		if (!replStarted) {
			replStarted = true;
			pod.run("node", [], { terminal: replTerminal });
		}
	}
</script>

<div
	id="demo"
	class="flex w-full max-w-6xl h-[60rem] sm:h-[45rem] md:h-[38rem] lg:h-[40rem] mx-auto rounded-2xl overflow-hidden relative"
	aria-label="In-browser Node.js demo playground"
>
	<div
		class="flex flex-col md:flex-row w-full h-full gap-2 md:gap-4 p-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl"
	>
		<!-- Browser Compatibility Overlay -->
		{#if !isCompatibleBrowser}
			<div
				class="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] rounded-2xl p-4"
			>
				<div
					class="max-w-md text-center px-6 py-8 bg-black/70 backdrop-blur-md rounded-xl border border-white/15 shadow-lg"
				>
					<div
						class="p-4 bg-amber-500/20 rounded-full inline-flex mx-auto mb-4"
					>
						<Icon
							icon="heroicons:exclamation-triangle"
							class="text-amber-400 w-10 h-10"
						/>
					</div>
					<h3 class="text-xl font-bold text-white mb-3">
						Incompatible Browser
					</h3>
					<p class="text-gray-200 mb-4">
						This demo requires a browser supporting <strong class="text-white"
							>Atomics.waitAsync</strong
						> (Chrome, Edge, Safari) to function properly.
					</p>
					<p class="text-gray-300 text-sm">
						Please switch to a compatible browser to experience the full
						capabilities of BrowserPod.
					</p>
				</div>
			</div>
		{/if}

		<div class="flex flex-col md:flex-row w-full h-full gap-2 md:gap-4">
			{#if showEditor || hasTerminalPanel}
				<div
					class="flex flex-col gap-2 md:gap-4 w-full md:flex-[2.7] min-w-0 h-[50%] md:h-full"
				>
					{#if showEditor}
						<div
							class="flex flex-col shadow-2xl flex-1 min-h-0 overflow-hidden"
						>
							<div
								class="flex items-center justify-between bg-gradient-to-b from-black/50 to-black/20 border border-white/15 rounded-t-xl shadow-2xl px-3 py-1.5"
							>
								<div
									class="text-xs text-white/80 font-semibold tracking-wide uppercase flex items-center"
								>
									<span class="mr-2">Editor</span>
									<span
										class="text-emerald-400 truncate max-w-[120px] sm:max-w-none"
										>{selectedFile}</span
									>
								</div>
							</div>
							<div
								class="overflow-hidden flex-1 min-h-0 h-full code-mirror-wrap bg-gradient-to-b from-black/50 to-black/20 border border-white/15 rounded-b-xl shadow-2xl border-t-0"
							>
								{#if loading}
									<div
										class="flex items-center justify-center h-full text-white/70"
									>
										<div class="animate-pulse flex flex-col items-center">
											<Icon
												icon="heroicons:arrow-path"
												class="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 mb-2"
											/>
											<span class="text-sm sm:text-base">Loading file...</span>
										</div>
									</div>
								{:else}
									<CodeMirror
										bind:value={fileContent}
										class="h-full"
										style="flex: 1; width: 100%; height: 100%; min-height: 0; display: block;"
										{extensions}
									/>
								{/if}
							</div>
						</div>
					{/if}
					{#if hasTerminalPanel}
						<!-- Terminal Panel -->
						<div
							class="flex flex-col shadow-2xl min-h-[6rem] sm:min-h-[8rem] overflow-hidden"
							class:flex-1={!showEditor}
							class:min-h-0={!showEditor}
						>
							<div class="flex items-end">
								{#if showTerminalTab}
									<div
										id="terminal-tab"
										class={`w-24 text-xs text-white/80 font-semibold tracking-wide uppercase bg-gradient-to-b from-black/50 to-black/20 border border-white/15 border-b-0 rounded-t-xl px-3 py-1.5 [&.active]:underline [&.active]:text-white [&:not(.active)]:text-white/50 [&:not(.active)]:cursor-pointer ${activeConsole === "terminal" ? "active" : ""}`}
										onclick={handleTerminalTabClick}
									>
										Terminal
									</div>
								{/if}
								{#if showReplTab}
									<div
										id="repl-tab"
										class={`w-24 text-xs text-white/80 font-semibold tracking-wide uppercase bg-gradient-to-b from-black/50 to-black/20 border border-white/15 border-b-0 rounded-t-xl px-3 py-1.5 [&.active]:underline [&.active]:text-white [&:not(.active)]:text-white/50 [&:not(.active)]:cursor-pointer ${activeConsole === "repl" ? "active" : ""}`}
										onclick={handleReplTabClick}
									>
										REPL
									</div>
								{/if}
							</div>
							<div
								class="flex-1 min-h-0 bg-gradient-to-b border border-white/15 rounded-b-xl shadow-2xl relative"
							>
								{#if showTerminalTab}
									<div
										class={`console w-full h-full rounded-b-xl border-none bg-black terminal-text-smaller pl-2 absolute [&:not(.active)]:invisible ${activeConsole === "terminal" ? "active" : ""}`}
										id="main-console"
										style="overflow: hidden;"
									></div>
								{/if}
								{#if showReplTab}
									<div
										class={`console w-full h-full rounded-b-xl border-none bg-black terminal-text-smaller pl-2 absolute [&:not(.active)]:invisible ${activeConsole === "repl" ? "active" : ""}`}
										id="repl-console"
										style="overflow: hidden;"
									></div>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}
			{#if showPreview}
				<!-- Preview Panel -->
				<div
					class="flex flex-col min-w-0 w-full md:flex-[2.3] h-[50%] md:h-full"
				>
					<div class="flex flex-col shadow-2xl h-full overflow-hidden">
						<div
							class="flex items-center justify-between bg-gradient-to-b from-black/50 to-black/20 border border-white/15 rounded-t-xl shadow-2xl px-3 py-1.5"
						>
							<div
								class="text-xs text-white/80 font-semibold tracking-wide uppercase flex items-center"
							>
								Preview
							</div>
							{#if portalURL}
								{#if isMobile}
									<button
										onclick={copyPortalURL}
										class="text-xs text-white/70 hover:text-white flex items-center flex-shrink-0 cursor-pointer"
										title="Copy portal URL"
										aria-label="Copy portal URL"
									>
										<Icon
											icon="heroicons:clipboard-document"
											width="14"
											height="14"
										/>
										<span class="ml-1"
											>{copied ? "Copied!" : "Copy Portal"}</span
										>
									</button>
								{:else}
									<button
										onclick={togglePortalInfo}
										class="text-xs text-white/70 hover:text-white flex items-center flex-shrink-0 cursor-pointer"
										title={showPortalInfo
											? "Hide portal info"
											: "Show portal info"}
										aria-label={showPortalInfo
											? "Hide portal info"
											: "Show portal info"}
									>
										<Icon
											icon={showPortalInfo
												? "heroicons:eye-slash"
												: "heroicons:qr-code"}
											width="14"
											height="14"
										/>
										<span class="ml-1"
											>{showPortalInfo ? "Hide Portal" : "Show Portal"}</span
										>
									</button>
								{/if}
							{:else}
								<button
									class="text-xs text-white/70 hover:text-white/50 flex items-center flex-shrink-0 cursor-not-allowed"
									title={"Portal Unavailable"}
									aria-label={"Portal Unavailable"}
								>
									<Icon icon="heroicons:no-symbol" width="14" height="14" />
									<span class="ml-1">{"Portal Unavailable"}</span>
								</button>
							{/if}
						</div>
						<div
							class="flex-1 min-h-0 bg-gradient-to-b from-black/50 to-black/20 border border-white/15 rounded-b-xl shadow-2xl border-t-0 relative"
						>
							{#if !portalURL && isCompatibleBrowser}
								<div
									class="flex items-center justify-center h-full text-white/70"
								>
									<div class="animate-pulse flex flex-col items-center">
										<Icon
											icon="heroicons:arrow-path"
											class="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-emerald-500 mb-2"
										/>
										<span class="text-sm sm:text-base">Loading preview...</span>
									</div>
								</div>
							{:else}
								<div class="w-full h-full relative">
									<div
										class="w-full h-full overflow-hidden flex items-center justify-center"
									>
										<iframe
											title="App Preview"
											src={portalURL}
											class="w-full h-full rounded-b-xl object-cover"
											style="border:none; background:#1a1a1a; transform-origin: center; max-width: 100%;"
											bind:this={portalElement}
										></iframe>
									</div>

									{#if showPortalInfo && !isMobile}
										<div
											class="fade-element absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs p-4"
										>
											<h2
												class="text-white text-2xl font-bold mb-6 tracking-wide drop-shadow-lg text-center"
											>
												Scan this Portal
											</h2>
											<div class="qr-code bg-white p-2 rounded-lg mb-4">
												<canvas
													bind:this={qrCodeCanvas}
													width="150"
													height="150"
												></canvas>
											</div>
											<div
												class="portal-url bg-black/60 p-3 rounded-lg w-full max-w-sm"
											>
												<p
													class="text-white text-xs sm:text-sm break-all text-center mb-2"
												>
													{portalURL}
												</p>
												<div class="flex space-x-2 justify-center">
													<button
														class="text-xs bg-emerald-600 hover:bg-emerald-500 text-white py-1 px-3 rounded flex items-center justify-center cursor-pointer"
														onclick={async () => {
															await navigator.clipboard.writeText(portalURL);
															copied = true;
															clearTimeout(copiedTimeout);
															copiedTimeout = setTimeout(
																() => (copied = false),
																1200
															);
														}}
													>
														<Icon
															icon="heroicons:clipboard-document"
															class="mr-1"
															width="14"
															height="14"
														/>
														{#if copied}
															Copied!
														{:else}
															Copy URL
														{/if}
													</button>
													<button
														class="text-xs bg-slate-700 hover:bg-slate-600 text-white py-1 px-3 rounded flex items-center justify-center cursor-pointer"
														onclick={togglePortalInfo}
													>
														<Icon
															icon="heroicons:x-mark"
															class="mr-1"
															width="14"
															height="14"
														/>
														Hide
													</button>
												</div>
											</div>
										</div>
									{/if}

									{#if showMobilePortal && isMobile && portalURL}
										<div
											class="fade-element absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
										>
											<h2
												class="text-white text-xl font-bold mb-4 tracking-wide drop-shadow-lg text-center"
											>
												Scan this Portal
											</h2>
											<div class="qr-code bg-white p-2 rounded-lg mb-3">
												<canvas
													bind:this={qrCodeCanvas}
													width="150"
													height="150"
												></canvas>
											</div>
											<div
												class="portal-url bg-black/60 p-3 rounded-lg w-full max-w-xs"
											>
												<p
													class="text-white text-xs break-all text-center mb-2"
												>
													{portalURL}
												</p>
												<div class="flex space-x-2 justify-center">
													<button
														class="text-xs bg-emerald-600 hover:bg-emerald-500 text-white py-1 px-3 rounded flex items-center justify-center cursor-pointer"
														onclick={copyPortalURL}
													>
														<Icon
															icon="heroicons:clipboard-document"
															class="mr-1"
															width="14"
															height="14"
														/>
														{copied ? "Copied!" : "Copy URL"}
													</button>
													<button
														class="text-xs bg-slate-700 hover:bg-slate-600 text-white py-1 px-3 rounded flex items-center justify-center cursor-pointer"
														onclick={toggleMobilePortal}
													>
														<Icon
															icon="heroicons:x-mark"
															class="mr-1"
															width="14"
															height="14"
														/>
														Close
													</button>
												</div>
											</div>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>

					{#if isMobile && portalURL && !showMobilePortal}
						<div class="mt-2 flex justify-center">
							<button
								class="text-xs bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-lg flex items-center justify-center cursor-pointer w-full max-w-xs shadow-md"
								onclick={toggleMobilePortal}
							>
								<Icon
									icon="heroicons:qr-code"
									class="mr-2"
									width="16"
									height="16"
								/>
								Show Portal QR Code
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		{#if !isCompatibleBrowser}
			<div
				class="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-br from-emerald-950/40 to-slate-950/50 pointer-events-none z-20"
			></div>
		{/if}
	</div>
</div>

<style>
	.code-mirror-wrap :global(.cm-editor) {
		height: 100%;
		background: transparent;
		color: rgba(255, 255, 255, 0.9);
	}

	.code-mirror-wrap :global(.cm-cursor) {
		border-left-color: white !important;
	}

	.code-mirror-wrap :global(.cm-scroller) {
		height: 100%;
		font-family: "Fira Code", "JetBrains Mono", monospace;
		font-size: 0.75rem;
	}

	@media (min-width: 640px) {
		.code-mirror-wrap :global(.cm-scroller) {
			font-size: 0.875rem;
		}
	}

	.code-mirror-wrap :global(.cm-gutters) {
		height: 100% !important;
		min-height: 100%;
		background: rgba(0, 0, 0, 0.2);
		border-right: 1px solid rgba(255, 255, 255, 0.15);
		color: rgba(255, 255, 255, 0.5);
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: 1;
	}

	.code-mirror-wrap :global(.cm-activeLineGutter) {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.8);
	}
	.code-mirror-wrap :global(.cm-lineNumbers .cm-gutterElement) {
		padding: 0 6px 0 3px;
	}

	@media (min-width: 640px) {
		.code-mirror-wrap :global(.cm-lineNumbers .cm-gutterElement) {
			padding: 0 8px 0 4px;
		}
	}

	.code-mirror-wrap :global(.cm-line) {
		padding: 0 6px 0 3px;
	}

	@media (min-width: 640px) {
		.code-mirror-wrap :global(.cm-line) {
			padding: 0 8px 0 4px;
		}
	}

	.code-mirror-wrap :global(.cm-activeLine) {
		background: rgba(255, 255, 255, 0.05);
	}

	/* Styles are handled outside the website, so these override that */
	.terminal-text-smaller :global(.xterm-rows) {
		font-size: 0.75rem !important;
	}

	@media (min-width: 640px) {
		.terminal-text-smaller :global(.xterm-rows) {
			font-size: 0.775rem !important;
		}
	}

	.fade-element {
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.qr-code {
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}
</style>
