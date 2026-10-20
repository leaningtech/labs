// The jar is fetched with fetch() and handed to CheerpJ's in-memory /str/ filesystem.
// The labs host (Cloudflare Pages) ignores Range requests, which CheerpJ needs to read
// a jar from /app/; at ~25 KB, downloading it whole costs nothing.
const VFS_JAR = "/str/forms.jar";
const WEB_JAR = new URL("./forms.jar", window.location.href).toString();

// Runtime chunks Forms needs before its first frame, from cjGetRuntimeResources()
// on this loader with Java 17 and wasmGC off. Regenerate after changing the jar, the loader
// or either of those options.
const PRELOAD = {
	"/lt/17/lib/modules": [
		0, 131072, 1572864, 4194304, 4325376, 4980736, 5242880, 5505024, 6029312,
		6291456, 6422528, 6684672, 7208960, 7471104, 8257536, 8388608, 10354688,
		10485760, 46661632, 46792704, 47316992, 47448064,
	],
	"/lt/etc/users": [0, 131072],
	"/lt/etc/localtime": [],
	"/lt/17/jre/lib/cheerpj-handlers.jar": [0, 131072],
	"/lt/17/jre/lib/cheerpj-awt.jar": [0, 131072],
	"/lt/17/jre/lib/cheerpj-jsobject.jar": [0, 131072],
};

const statusLabel = document.getElementById("status-label");
const statusDot = document.getElementById("status-dot");

function setStatus(text, busy) {
	statusLabel.textContent = text;
	statusDot.classList.toggle("busy", busy);
}

// The loader's bar: the runtime preload fills it to 90%, the form appearing does the rest.
const loader = document.getElementById("loader");
const loaderFill = document.getElementById("loader-fill");

function setProgress(fraction) {
	loaderFill.classList.remove("indeterminate");
	loaderFill.style.transform = `scaleX(${fraction})`;
	loader.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
}

function hideLoader() {
	setProgress(1);
	loader.classList.add("done");
	loader.addEventListener("transitionend", () => loader.remove(), {
		once: true,
	});
	// No transition with reduced motion, so no transitionend either.
	setTimeout(() => loader.remove(), 500);
}

// The DOM side of Forms' Web class: Java runs the form and its event loop, and calls these to
// show frames and to wait for events. See src/Web.java for what each one does.
let canvas, ctx, image;
let shown = false;
const events = [];
let wake = null;

function post(event) {
	events.push(event);
	if (wake) wake();
}

let formW, formH;

function formXY(e) {
	const r = canvas.getBoundingClientRect();
	const x = Math.floor(((e.clientX - r.left) * formW) / r.width);
	const y = Math.floor(((e.clientY - r.top) * formH) / r.height);
	return `${x} ${y}`;
}

const natives = {
	Java_Web_devicePixelRatio(lib) {
		return window.devicePixelRatio;
	},
	Java_Web_open(lib, w, h, scale, keys, ctrlKeys) {
		keys = new Set(keys);
		ctrlKeys = new Set(ctrlKeys);
		formW = w;
		formH = h;
		canvas = document.createElement("canvas");
		canvas.width = w * scale;
		canvas.height = h * scale;
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		canvas.tabIndex = 0;
		ctx = canvas.getContext("2d");
		image = ctx.createImageData(w * scale, h * scale);
		canvas.addEventListener("mousedown", (e) => post("d " + formXY(e)));
		canvas.addEventListener("mousemove", (e) => post("m " + formXY(e)));
		canvas.addEventListener("keydown", (e) => {
			// Cmd/Alt shortcuts and IME composition stay with the browser.
			if (e.metaKey || e.altKey || e.isComposing) return;
			const k = e.keyCode;
			const typed = e.key.length === 1 && !e.ctrlKey;
			if (!keys.has(k) && !typed && !(e.ctrlKey && ctrlKeys.has(k))) return;
			e.preventDefault();
			const ch = typed ? e.key.charCodeAt(0) : -1;
			post(`k ${k} ${e.ctrlKey ? 1 : 0} ${e.shiftKey ? 1 : 0} ${ch}`);
		});
		document.getElementById("container").appendChild(canvas);
		canvas.focus({ preventScroll: true });
	},
	Java_Web_present(lib, px) {
		image.data.set(new Uint8Array(px.buffer, px.byteOffset, px.length * 4));
		ctx.putImageData(image, 0, 0);
		if (!shown) {
			// The form is on screen.
			shown = true;
			hideLoader();
			setStatus("Running", false);
		}
	},
	Java_Web_setCursor(lib, cursor) {
		canvas.style.cursor = cursor;
	},
	Java_Web_nextEvent(lib, timeoutMs) {
		if (events.length > 0 || timeoutMs === 0)
			return events.length > 0 ? events.shift() : "";
		return new Promise((resolve) => {
			const timer = setTimeout(() => {
				wake = null;
				resolve("");
			}, timeoutMs);
			wake = () => {
				clearTimeout(timer);
				wake = null;
				resolve(events.shift());
			};
		});
	},
};

(async () => {
	// Start the jar download in parallel with CheerpJ starting up.
	const jar = fetch(WEB_JAR).then((resp) => {
		if (!resp.ok) {
			throw new Error(
				`Failed to fetch ${WEB_JAR}: ${resp.status} ${resp.statusText}`
			);
		}
		return resp.arrayBuffer();
	});

	setStatus("Starting CheerpJ…", true);
	await cheerpjInit({
		version: 17,
		// Java 17 hangs with wasmGC on this build (and wasmGC ignores natives).
		wasmGC: false,
		preloadResources: PRELOAD,
		preloadProgress: (done, total) => setProgress((0.9 * done) / total),
		natives,
	});
	cheerpOSAddStringFile(VFS_JAR, new Uint8Array(await jar));

	// No CheerpJ display: Forms doesn't use AWT, it draws through Web's natives. Resolves only
	// when the JVM exits.
	await cheerpjRunMain("Forms", VFS_JAR);
	setStatus("Forms exited", false);
})().catch((err) => {
	console.error("Init failed:", err);
	setStatus("Failed to start", false);
});
