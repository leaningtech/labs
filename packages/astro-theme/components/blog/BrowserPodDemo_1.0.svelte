<script>
	import {
		BrowserPodEditorProvider,
		EditorPanel,
		TerminalPanel,
		PreviewPanel,
		setAnalyticsCallback,
	} from "@leaningtech/svelte-browserpod-editor";
	import "@leaningtech/svelte-browserpod-editor/theme.css";

	let { projectSource, children, apiKey } = $props();

	const terminalTabs = [
		{
			id: "build",
			label: "Build",
			commands: [
				["npm", "install"],
				["npm", "run", "dev"],
			],
			autoRun: true,
		},
		{
			id: "repl",
			label: "REPL",
			commands: [["node"]],
			runOnActivate: true,
		},
	];
</script>

<div
	id="demo"
	class="flex w-full max-w-6xl h-[50rem] sm:h-[38rem] md:h-[32rem] lg:h-[34rem] mx-auto rounded-2xl overflow-hidden relative"
	aria-label="In-browser Node.js demo playground"
>
	<div
		class="flex flex-col md:flex-row w-full h-full gap-2 md:gap-4 p-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl"
	>
		<BrowserPodEditorProvider
			{projectSource}
			{apiKey}
			ctxId="demo"
			defaultFile="src/lib/Counter.svelte"
		>
			<!-- Editor + Terminal column -->
			<div
				class="flex flex-col gap-2 md:gap-4 w-full md:flex-[2] min-w-0 h-[55%] md:h-full"
			>
				<div class="editor-slot">
					<EditorPanel />
				</div>
				<div class="terminal-slot">
					<TerminalPanel tabs={terminalTabs} />
				</div>
			</div>

			<!-- Preview column -->
			<div class="preview-slot">
				<PreviewPanel />
			</div>
		</BrowserPodEditorProvider>
	</div>
</div>

<style>
	:root {
		--bpe-color-primary: #10b981;
		--bpe-color-primary-hover: #059669;
	}

	.editor-slot {
		display: flex;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.terminal-slot {
		display: flex;
		min-height: 6rem;
		height: 35%;
		overflow: hidden;
	}

	@media (min-width: 640px) {
		.terminal-slot {
			min-height: 10rem;
		}
	}

	@media (min-width: 768px) {
		.terminal-slot {
			height: 35%;
		}
	}

	.preview-slot {
		display: flex;
		flex-direction: column;
		min-width: 0;
		width: 100%;
		height: 60%;
	}

	@media (min-width: 768px) {
		.preview-slot {
			flex: 1.7;
			height: 100%;
		}
	}
</style>
