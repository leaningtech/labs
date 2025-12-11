const JARS = {
	demo: "/app/FlatLaf-Demo/FlatLaf/flatlaf-demo-3.7.jar",
	editor: "/app/FlatLaf-Demo/FlatLaf/flatlaf-theme-editor-3.7.jar",
};

const btnDemo = document.getElementById("btn-demo");
const btnEditor = document.getElementById("btn-editor");
const statusLabel = document.getElementById("status-label");
const statusAppName = document.getElementById("status-app-name");

let currentApp = null;

(async () => {
	statusLabel.textContent = "Starting CheerpJ…";

	await cheerpjInit({
		version: 17,
	});

	cheerpjCreateDisplay(-1, -1, document.getElementById("container"));

	statusLabel.textContent = "Launching Demo…";

	runApp("demo");

	btnDemo.addEventListener("click", () => runApp("demo"));
	btnEditor.addEventListener("click", () => runApp("editor"));
})();

async function runApp(which) {
	if (which === currentApp) {
		return;
	}

	currentApp = which;

	btnDemo.classList.toggle("active", which === "demo");
	btnEditor.classList.toggle("active", which === "editor");

	statusLabel.textContent = "Launching " + labelFor(which) + "…";
	statusAppName.textContent = labelFor(which);

	console.log("Starting FlatLaf " + which);

	cheerpjRunJar(JARS[which])
		.then((code) => {
			console.log(which + " exited with code", code);
			if (currentApp === which) {
				statusLabel.textContent = labelFor(which) + " finished.";
			}
		})
		.catch((err) => {
			console.error(which + " failed:", err);
			if (currentApp === which) {
				statusLabel.textContent = "Error starting " + labelFor(which);
			}
		});
}

function labelFor(which) {
	return which === "editor" ? "Theme Editor" : "Demo";
}
