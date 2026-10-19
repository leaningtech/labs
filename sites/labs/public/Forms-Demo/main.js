// The jar is fetched with fetch() and handed to CheerpJ's in-memory /str/ filesystem.
// The labs host (Cloudflare Pages) ignores Range requests, which CheerpJ needs to read
// a jar from /app/; at 20 KB, downloading it whole costs nothing.
const VFS_JAR = "/str/forms.jar";
const WEB_JAR = new URL("./Forms/forms.jar", window.location.href).toString();

// Runtime chunks Forms needs before its first frame, from cjGetRuntimeResources()
// on this loader with wasmGC. Regenerate after changing the jar or the loader.
const PRELOAD = {
	"/lt/8/jre/lib/rt.jar": [
		0, 131072, 9699328, 10878976, 11403264, 11534336, 11665408, 11796480,
		11927552, 12189696, 12320768, 12451840, 15204352, 15335424, 15466496,
		15597568, 15990784, 16121856, 16252928, 16384000, 17170432, 17563648,
		17694720, 17825792, 18350080, 18612224, 18743296, 18874368, 19005440,
		19136512, 20840448, 21233664, 21364736, 21757952, 22151168, 27000832,
	],
	"/lt/etc/users": [0, 131072],
	"/lt/etc/localtime": [],
	"/lt/8/jre/lib/cheerpj-awt.jar": [0, 131072],
	"/lt/8/lib/ext/meta-index": [0, 131072],
	"/lt/8/lib/ext": [],
	"/lt/8/lib/ext/index.list": [],
	"/lt/8/lib/ext/localedata.jar": [],
	"/lt/8/jre/lib/jsse.jar": [0, 131072, 786432, 917504],
	"/lt/8/jre/lib/jce.jar": [0, 131072],
	"/lt/8/jre/lib/charsets.jar": [0, 131072, 1703936, 1835008],
	"/lt/8/jre/lib/resources.jar": [0, 131072, 917504, 1179648],
	"/lt/8/jre/lib/javaws.jar": [0, 131072, 1441792, 1703936],
	"/lt/8/lib/ext/sunec.jar": [],
	"/lt/8/lib/ext/sunjce_provider.jar": [],
	"/lt/8/lib/ext/zipfs.jar": [],
	"/lt/8/jre/lib/meta-index": [0, 131072],
	"/lt/8/jre/lib": [],
	"/lt/8/lib/accessibility.properties": [],
	"/lt/8/lib/fonts/LucidaSansRegular.ttf": [],
};

const statusLabel = document.getElementById("status-label");
const statusDot = document.getElementById("status-dot");

function setStatus(text, busy) {
	statusLabel.textContent = text;
	statusDot.classList.toggle("busy", busy);
}

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
		// Measured ~0.3 s faster to the first frame than without it.
		wasmGC: true,
		preloadResources: PRELOAD,
	});
	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));

	cheerpOSAddStringFile(VFS_JAR, new Uint8Array(await jar));
	setStatus("Running", false);

	// Resolves only when the JVM exits.
	await cheerpjRunMain("Forms", VFS_JAR, "web");
	setStatus("Forms exited", false);
})().catch((err) => {
	console.error("Init failed:", err);
	setStatus("Failed to start", false);
});
