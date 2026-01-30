// Jar and theme location inside the CheerpJ VFS
const VFS_DIR = "/files/FlatLaf-Demo";
const VFS_JARS = {
	demo: `${VFS_DIR}/flatlaf-demo-3.7.jar`,
	editor: `${VFS_DIR}/flatlaf-theme-editor-3.7.jar`,
};
const VFS_THEME = `/files/CheerpJ Demo Theme.properties`;

// Where the jars live on the website
const WEB_JARS = {
	demo: new URL(
		"./FlatLaf/flatlaf-demo-3.7.jar",
		window.location.href
	).toString(),
	editor: new URL(
		"./FlatLaf/flatlaf-theme-editor-3.7.jar",
		window.location.href
	).toString(),
};

// Where the theme live on the website
const WEB_THEME = new URL(
	"./FlatLaf/demo-theme.properties",
	window.location.href
).toString();

const btnDemo = document.getElementById("btn-demo");
const btnEditor = document.getElementById("btn-editor");
const statusLabel = document.getElementById("status-label");

// Library-mode to handle filesystem work
let lib = null;

// Status helper (auto-resets after a short delay)
let statusTimer = null;

function setStatus(text, { autoResetMs = 3500 } = {}) {
	statusLabel.textContent = text;

	if (statusTimer) clearTimeout(statusTimer);
	if (autoResetMs > 0) {
		statusTimer = setTimeout(() => {
			statusLabel.textContent = "Ready — click a button to open a window";
			statusTimer = null;
		}, autoResetMs);
	}
}

(async () => {
	setStatus("Starting CheerpJ…", { autoResetMs: 0 });

	await cheerpjInit({
		version: 17,
	});

	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));

	// Library mode to write files in the VFS
	lib = await cheerpjRunLibrary("");

	setStatus("Preparing demo files…", { autoResetMs: 0 });

	// Ensure jars exist in VFS
	await ensureJarInVfs("demo");
	await ensureJarInVfs("editor");
	await ensureThemeInVfs();

	// Start the demo automatically
	setStatus("Opening Demo…");
	runApp("demo");

	// Buttons act as launch actions
	btnDemo.addEventListener("click", () => runApp("demo"));
	btnEditor.addEventListener("click", () => runApp("editor"));

	setStatus("Ready — click a button to open a window", { autoResetMs: 0 });
})().catch((err) => {
	console.error("Init failed:", err);
	setStatus("Failed to start", { autoResetMs: 0 });
});

function labelFor(which) {
	return which === "editor" ? "Theme Editor" : "Demo";
}

async function ensureJarInVfs(which) {
	const targetPath = VFS_JARS[which];
	const sourceUrl = WEB_JARS[which];

	const Files = await lib.java.nio.file.Files;
	const Paths = await lib.java.nio.file.Paths;

	await Files.createDirectories(await Paths.get(VFS_DIR));

	const exists = await Files.exists(await Paths.get(targetPath));
	if (exists) {
		console.log(`[VFS] ${which} jar already present: ${targetPath}`);
		return;
	}

	console.log(`[WEB] Downloading ${which} jar: ${sourceUrl}`);
	setStatus(`Downloading ${labelFor(which)} JAR…`, { autoResetMs: 0 });

	const resp = await fetch(sourceUrl);
	if (!resp.ok) {
		throw new Error(
			`Failed to fetch ${sourceUrl}: ${resp.status} ${resp.statusText}`
		);
	}

	const buf = await resp.arrayBuffer();
	const byteArr = Array.from(new Int8Array(buf));

	console.log(
		`[VFS] Writing ${which} jar to: ${targetPath} (${byteArr.length} bytes)`
	);

	const FileOutputStream = await lib.java.io.FileOutputStream;
	const fos = await new FileOutputStream(targetPath);
	await fos.write(byteArr);
	await fos.close();

	console.log(`[VFS] Done: ${targetPath}`);
}

async function ensureThemeInVfs() {
	const targetPath = VFS_THEME;
	const sourceUrl = WEB_THEME;

	const Files = await lib.java.nio.file.Files;
	const Paths = await lib.java.nio.file.Paths;

	await Files.createDirectories(await Paths.get(VFS_DIR));

	const exists = await Files.exists(await Paths.get(targetPath));
	if (exists) {
		console.log(`[VFS] theme already present: ${targetPath}`);
		return;
	}

	console.log(`[WEB] Downloading theme: ${sourceUrl}`);
	setStatus("Downloading demo theme…", { autoResetMs: 0 });

	const resp = await fetch(sourceUrl);
	if (!resp.ok) {
		throw new Error(
			`Failed to fetch ${sourceUrl}: ${resp.status} ${resp.statusText}`
		);
	}

	// Fetch as text and encode to bytes
	const themeText = await resp.text();
	const encoded = new TextEncoder().encode(themeText);
	const byteArr = Array.from(new Int8Array(encoded.buffer));

	console.log(
		`[VFS] Writing theme to: ${targetPath} (${byteArr.length} bytes)`
	);

	const FileOutputStream = await lib.java.io.FileOutputStream;
	const fos = await new FileOutputStream(targetPath);
	await fos.write(byteArr);
	await fos.close();

	console.log(`[VFS] Done: ${targetPath}`);
}

function runApp(which) {
	const label = labelFor(which);
	const jarPath = VFS_JARS[which];

	setStatus(`Opening ${label}…`);
	console.log(`Starting FlatLaf ${which} from ${jarPath}`);

	// Promise resolves only when JVM exits
	cheerpjRunJar(jarPath)
		.then(() => {
			setStatus(`${label} exited`, { autoResetMs: 6000 });
		})
		.catch((err) => {
			console.error(`${which} failed:`, err);
			setStatus(`Failed to open ${label}`, { autoResetMs: 6000 });
		});
}
