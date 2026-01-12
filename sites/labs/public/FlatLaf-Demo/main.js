// Jar location inside the CheerpJ VFS
const VFS_DIR = "/files/FlatLaf-Demo";
const VFS_JARS = {
	demo: `${VFS_DIR}/flatlaf-demo-3.7.jar`,
	editor: `${VFS_DIR}/flatlaf-theme-editor-3.7.jar`,
};

// Where the jars live the website
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

const btnDemo = document.getElementById("btn-demo");
const btnEditor = document.getElementById("btn-editor");
const statusLabel = document.getElementById("status-label");
const statusAppName = document.getElementById("status-app-name");

let currentApp = null;

// Library-mode to handle filesystem work
let lib = null;

(async () => {
	statusLabel.textContent = "Starting CheerpJ";

	await cheerpjInit({
		version: 17,
	});

	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));

	// Library mode to write files in the VFS
	lib = await cheerpjRunLibrary("");

	statusLabel.textContent = "Preparing demo files";

	// Ensure jars exist in VFS
	await ensureJarInVfs("demo");
	await ensureJarInVfs("editor");

	statusLabel.textContent = "Launching Demo";
	runApp("demo");

	btnDemo.addEventListener("click", () => runApp("demo"));
	btnEditor.addEventListener("click", () => runApp("editor"));
})().catch((err) => {
	console.error("Init failed:", err);
	statusLabel.textContent = "Failed to start";
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
	statusLabel.textContent = `Downloading ${labelFor(which)} JAR`;

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

function runApp(which) {
	if (which === currentApp) return;

	currentApp = which;

	btnDemo.classList.toggle("active", which === "demo");
	btnEditor.classList.toggle("active", which === "editor");

	const label = labelFor(which);
	statusLabel.textContent = `Launching ${label}…`;
	statusAppName.textContent = label;

	// Run the jar from VFS path
	const jarPath = VFS_JARS[which];

	console.log(`Starting FlatLaf ${which} from ${jarPath}`);

	cheerpjRunJar(jarPath)
		.then((code) => console.log(`${which} exited with code`, code))
		.catch((err) => {
			console.error(`${which} failed:`, err);
			statusLabel.textContent = `Error starting ${label}`;
		});
}
