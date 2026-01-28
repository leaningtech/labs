const COMMONMARK_JAR_NAME = "commonmark-0.27.1.jar";
const WEB_JAR_URL = new URL(
	`./CommonMark/${COMMONMARK_JAR_NAME}`,
	window.location.href
).toString();
const STR_JAR_PATH = `/str/${COMMONMARK_JAR_NAME}`;

const mdInput = document.getElementById("md-input");
const preview = document.getElementById("preview");

const btnRender = document.getElementById("btn-render");
const btnReset = document.getElementById("btn-reset");
const btnHelp = document.getElementById("btn-help");
const btnCloseSide = document.getElementById("btn-close-side");

const liveToggle = document.getElementById("live-toggle");

const statusLabel = document.getElementById("status-label");
const dot = document.getElementById("dot");

const side = document.getElementById("side");
const workspace = document.getElementById("workspace");

let lib = null;
let parser = null;
let renderer = null;

let lastHtml = "";
let renderTimer = null;
let previewHtmlTpl = null;
let previewCssText = null;

function setBusy(isBusy) {
	dot.classList.toggle("busy", Boolean(isBusy));
}

function setStatus(text, { busy = false } = {}) {
	statusLabel.textContent = text;
	setBusy(busy);
}

function setSideVisible(visible) {
	side.classList.toggle("side-hidden", !visible);
	workspace.classList.toggle("no-side", !visible);
}

function applyLiveUiState() {
	// Only show Render button when Live is OFF
	const live = liveToggle.checked;
	btnRender.style.display = live ? "none" : "inline-flex";
}

function debounceRender(ms = 300) {
	if (renderTimer) clearTimeout(renderTimer);
	renderTimer = setTimeout(() => renderMarkdown({ reason: "live" }), ms);
}

function defaultMarkdown() {
	return (
		"# Hello CommonMark 👋\n\n" +
		"This page uses **CheerpJ library mode** to run **Java** in the browser.\n\n" +
		"## What to try\n\n" +
		"- **Bold**, _italic_, `inline code`\n" +
		"- Links: https://cheerpj.com\n" +
		"- Code blocks:\n\n" +
		"```js\n" +
		"console.log('Rendered by Java (CommonMark)');\n" +
		"```\n\n" +
		'> Markdown is forgiving — "invalid" syntax is usually treated as text.\n'
	);
}

async function loadJarIntoStrVfs() {
	setStatus("Fetching CommonMark JAR…", { busy: true });

	const resp = await fetch(WEB_JAR_URL);
	if (!resp.ok) {
		throw new Error(
			`Failed to fetch ${WEB_JAR_URL}: ${resp.status} ${resp.statusText}`
		);
	}

	const buf = await resp.arrayBuffer();
	const u8 = new Uint8Array(buf);

	setStatus("Injecting JAR into /str…", { busy: true });

	try {
		cheerpOSAddStringFile(STR_JAR_PATH, u8);
		console.log("Jar added using cherrpOSAddStringFile");
	} catch (err) {
		console.log("Could not add Jar using cherrpOSAddStringFile");
		setStatus("Failed to inject JAR into /str…", { busy: true });
	}
}

async function init() {
	applyLiveUiState();
	setSideVisible(true);

	setStatus("Starting CheerpJ…", { busy: true });
	await cheerpjInit({ version: 17 });

	// fetch + add jar into /str at startup
	await loadJarIntoStrVfs();

	setStatus("Loading CommonMark…", { busy: true });

	lib = await cheerpjRunLibrary(STR_JAR_PATH);

	const Parser = await lib.org.commonmark.parser.Parser;
	const HtmlRenderer = await lib.org.commonmark.renderer.html.HtmlRenderer;

	parser = await (await Parser.builder()).build();
	renderer = await (await HtmlRenderer.builder()).build();

	setStatus("Ready", { busy: false });

	// Initial content + first render
	if (!mdInput.value) mdInput.value = defaultMarkdown();
	await renderMarkdown({ reason: "init" });
}

async function renderMarkdown({ reason = "manual" } = {}) {
	if (!parser || !renderer) return;

	try {
		setStatus("Rendering…", { busy: true });

		const md = mdInput.value ?? "";
		const docNode = await parser.parse(md);
		const html = await renderer.render(docNode);
		const htmlStr = await html.toString();

		// Avoid reloading the iframe if unchanged
		if (htmlStr !== lastHtml) {
			lastHtml = htmlStr;

			try {
				preview.srcdoc = await buildPreviewDoc(htmlStr);
			} catch (e) {
				console.error("Preview build failed:", e);

				// Visible error in the preview instead of a blank frame
				preview.srcdoc = `<!doctype html><meta charset="utf-8">
					<body style="font-family:system-ui;padding:16px">
					<h3>Preview failed</h3>
					<pre>${String(e)}</pre>
					</body>`;
			}
		}
		setStatus("Rendered", { busy: false });
	} catch (err) {
		console.error("Render failed:", err);
		setStatus("Render failed — see console", { busy: false });
	}
}

async function loadPreviewAssets() {
	if (previewHtmlTpl && previewCssText) return;

	const htmlUrl = new URL(
		"./Template/preview.html",
		window.location.href
	).toString();
	const cssUrl = new URL(
		"./Template/preview.css",
		window.location.href
	).toString();

	const [htmlResp, cssResp] = await Promise.all([
		fetch(htmlUrl),
		fetch(cssUrl),
	]);

	if (!htmlResp.ok)
		throw new Error(
			`Failed to load preview.html: ${htmlResp.status} ${htmlResp.statusText}`
		);
	if (!cssResp.ok)
		throw new Error(
			`Failed to load preview.css: ${cssResp.status} ${cssResp.statusText}`
		);

	previewHtmlTpl = await htmlResp.text();
	previewCssText = await cssResp.text();
}

async function buildPreviewDoc(htmlBody) {
	await loadPreviewAssets();

	if (!previewHtmlTpl.includes("<!--__CSS__-->")) {
		throw new Error("preview.html missing <!--__CSS__--> marker");
	}
	if (!previewHtmlTpl.includes("<!--__BODY__-->")) {
		throw new Error("preview.html missing <!--__BODY__--> marker");
	}

	return previewHtmlTpl
		.replace("<!--__CSS__-->", `<style>${previewCssText}</style>`)
		.replace("<!--__BODY__-->", htmlBody || "");
}

// Events
mdInput.addEventListener("input", () => {
	if (liveToggle.checked) debounceRender(300);
});

liveToggle.addEventListener("change", () => {
	applyLiveUiState();
	// If user turns live ON, render once immediately
	if (liveToggle.checked) renderMarkdown({ reason: "manual" });
});

btnRender.addEventListener("click", () => renderMarkdown({ reason: "manual" }));

btnReset.addEventListener("click", async () => {
	mdInput.value = defaultMarkdown();
	await renderMarkdown({ reason: "manual" });
});

btnHelp.addEventListener("click", () => {
	const isHidden = side.classList.contains("side-hidden");
	setSideVisible(isHidden);
});

btnCloseSide.addEventListener("click", () => {
	setSideVisible(false);
});

// Start
init().catch((err) => {
	console.error("Init failed:", err);
	setStatus("Failed to start", { busy: false });
});
