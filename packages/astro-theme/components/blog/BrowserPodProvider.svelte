<script>
	import { BrowserPod } from "../../lib/browserpod.ts";
	import { BrowserPodEditorProvider } from "@leaningtech/svelte-browserpod-editor";
	import "@leaningtech/svelte-browserpod-editor/theme.css";

	// terminalStyle="kit": smaller monospace text on the page background,
	//   in the style of the BrowserPod design kit.
	let {
		ctxId,
		version,
		projectSource,
		apiKey,
		userImage,
		storageKey = undefined,
		terminalStyle = undefined,
	} = $props();

	const KIT_TERMINAL = {
		fontSize: 13,
		lineHeight: 1.35,
		fontFamily:
			"'Commit Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
		cursorBlink: true,
	};

	function fit(xterm, element) {
		const dims = xterm._core?._renderService?.dimensions;
		const w = dims?.css.cell.width;
		const h = dims?.css.cell.height;
		if (!w || !h || !element) return;
		const cols = Math.max(2, Math.floor(element.clientWidth / w));
		const rows = Math.max(1, Math.floor(element.clientHeight / h));
		if (xterm.cols !== cols || xterm.rows !== rows) xterm.resize(cols, rows);
	}

	function styleTerminals(pod) {
		if (terminalStyle !== "kit") return pod;
		const createDefaultTerminal = pod.createDefaultTerminal.bind(pod);
		pod.createDefaultTerminal = async (element) => {
			const terminal = await createDefaultTerminal(element);
			const xterm = terminal?.xterm;
			if (xterm) {
				const background = getComputedStyle(document.body).backgroundColor;
				Object.assign(xterm.options, KIT_TERMINAL, {
					theme: {
						...xterm.options.theme,
						background,
						foreground: "#d4d4d8",
						cursor: "#b7cdff",
						selectionBackground: "rgba(183,205,255,0.25)",
					},
				});
				requestAnimationFrame(() => fit(xterm, element));
			}
			return terminal;
		};
		return pod;
	}

	// svelte-ignore state_referenced_locally
	const pod = BrowserPod(version)
		.boot({ apiKey, userImage, storageKey })
		.then(styleTerminals);
</script>

<BrowserPodEditorProvider {projectSource} {pod} {ctxId} />
