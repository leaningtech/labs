<script>
	import { BrowserPod } from "../../lib/browserpod.ts";
	import { BrowserPodEditorProvider } from "@leaningtech/svelte-browserpod-editor";
	import "@leaningtech/svelte-browserpod-editor/theme.css";
	import xtermCss from "@xterm/xterm/css/xterm.css?inline";

	// opinionatedFetch: boot without an apiKey, on a fetch network that uses
	//   BrowserPod.opinionatedFetch.
	// terminalStyle="kit": terminal colours of the BrowserPod design kit, on
	//   the page background.
	let {
		ctxId,
		version,
		projectSource,
		apiKey,
		userImage,
		storageKey = undefined,
		opinionatedFetch = false,
		terminalStyle = undefined,
	} = $props();

	const FONT_FAMILY = "monospace";
	// NOTE: Room for the scrollbar that xterm overlays on the right edge
	const SCROLLBAR_WIDTH = 14;

	function kitTheme() {
		return {
			background: getComputedStyle(document.body).backgroundColor,
			foreground: "#d4d4d8",
			cursor: "#b7cdff",
			selectionBackground: "rgba(183,205,255,0.25)",
		};
	}

	function charWidthRatio() {
		const ctx = document.createElement("canvas").getContext("2d");
		ctx.font = `100px ${FONT_FAMILY}`;
		return ctx.measureText("W").width / 100;
	}

	// A terminal with a fixed grid: the pod is told the grid once, and the
	// font size follows the available width, so the grid never changes.
	// NOTE: The returned terminal has no `xterm` property, so TerminalPanel
	// does not resize the view behind the pod's back.
	// NOTE: The view lives in a shadow root. xterm scopes its font and colour
	// rules with a class numbered per copy of the library, and the runtime
	// bundles a copy of its own, so in the same tree the numbers collide and
	// each terminal picks up the other's rules.
	async function createFitTerminal(pod, pane, frame) {
		const cols = Number(frame.dataset.bpFitCols);
		const rows = Number(frame.dataset.bpFitRows);
		const { Terminal } = await import("@xterm/xterm");
		const ratio = charWidthRatio();
		const maxFontSize = parseInt(getComputedStyle(document.body).fontSize, 10);
		// NOTE: Everything around the grid: borders, pane padding, scrollbar
		const chromeWidth = () => {
			const style = getComputedStyle(pane);
			return (
				frame.offsetWidth -
				pane.clientWidth +
				parseFloat(style.paddingLeft) +
				parseFloat(style.paddingRight) +
				SCROLLBAR_WIDTH
			);
		};
		const container = frame.parentElement;
		const fontSize = () => {
			const width = container.clientWidth - chromeWidth();
			const size = Math.floor((2 * width) / (cols * ratio)) / 2;
			return Math.max(4, Math.min(maxFontSize, size));
		};
		const xterm = new Terminal({
			cols,
			rows,
			fontFamily: FONT_FAMILY,
			fontSize: fontSize(),
			cursorBlink: true,
			convertEol: true,
			theme: terminalStyle === "kit" ? kitTheme() : undefined,
		});
		const terminal = await pod.createCustomTerminal({
			cols,
			rows,
			onOutput: (buf) => xterm.write(new Uint8Array(buf)),
		});
		const root = pane.attachShadow({ mode: "open" });
		const style = document.createElement("style");
		style.textContent = xtermCss;
		const host = document.createElement("div");
		root.append(style, host);
		xterm.open(host);
		xterm.onData((data) => terminal.readData(data));

		// The frame hugs the grid: as wide and as tall as its chrome plus the grid
		const layout = () => {
			xterm.options.fontSize = fontSize();
			const screen = host.querySelector(".xterm-screen");
			const chromeHeight = frame.offsetHeight - pane.clientHeight;
			frame.style.width = `${chromeWidth() + screen.offsetWidth}px`;
			frame.style.setProperty(
				"--bp-fit-height",
				`${chromeHeight + screen.offsetHeight}px`
			);
		};
		let lastWidth = container.clientWidth;
		new ResizeObserver(() => {
			if (container.clientWidth === lastWidth) return;
			lastWidth = container.clientWidth;
			layout();
		}).observe(container);
		layout();
		return terminal;
	}

	function wrapTerminals(pod) {
		const createDefaultTerminal = pod.createDefaultTerminal.bind(pod);
		pod.createDefaultTerminal = async (element) => {
			const frame = element.closest("[data-bp-fit-cols]");
			if (frame) return createFitTerminal(pod, element, frame);
			const terminal = await createDefaultTerminal(element);
			if (terminalStyle === "kit")
				terminal.xterm.options.theme = {
					...terminal.xterm.options.theme,
					...kitTheme(),
				};
			return terminal;
		};
		return pod;
	}

	// svelte-ignore state_referenced_locally
	const pod = BrowserPod(version)
		.boot({ apiKey, userImage, storageKey, opinionatedFetch })
		.then(wrapTerminals);
</script>

<BrowserPodEditorProvider {projectSource} {pod} {ctxId} />
