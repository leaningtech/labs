import "./terminal-os-tabs.css";

const replacements = [
	[
		/^\/opt\/cheerp\/bin\/([^ ]+)/,
		{
			win: "C:\\cheerp\\bin\\$1.exe",
			mac: "/Applications/cheerp/bin/$1",
			linux: "/opt/cheerp/bin/$1",
		},
	],
];

let os = localStorage.getItem("os") ?? getOs();

function getOs() {
	if (navigator.platform.indexOf("Win") != -1) return "win";
	if (navigator.platform.indexOf("Mac") != -1) return "mac";
	return "linux";
}

document.addEventListener("DOMContentLoaded", () => {
	const figures = document.querySelectorAll(
		// ```shell blocks
		".expressive-code figure.is-terminal"
	);

	const updateFuncs = [];

	for (const figure of figures) {
		const commands = figure.querySelectorAll(".ec-line > span:first-child");
		let needsTabs = false;
		let needsFixCopy = false;

		for (let command of commands) {
			// Ignore leading $ and space
			if (command.innerText === "$") {
				// Make the $ and space not selectable
				command.style.userSelect = "none";

				command = command.nextElementSibling;
				if (command.innerText !== " ") {
					console.error("Expected space after $", command);
					continue;
				}
				command.style.userSelect = "none";

				command = command.nextElementSibling; // The actual command

				needsFixCopy = true;
			}

			// Skip if no match
			let didMatch = false;
			for (const [regex] of replacements) {
				if (regex.test(command.innerText)) {
					didMatch = true;
					break;
				}
			}
			if (!didMatch) continue;

			needsFixCopy = true;

			// Queue update
			const originalText = command.innerText;
			updateFuncs.push(() => {
				command.innerText = originalText;
				for (const [regex, obj] of replacements) {
					command.innerText = command.innerText.replace(regex, obj[os] ?? "$0");
				}
			});

			needsTabs = true;
		}

		if (needsTabs) {
			const header = figure.querySelector(".header");
			header.classList.add("has-tabs");
			header.appendChild(makeTabButton("Linux", "linux"));
			header.appendChild(makeTabButton("macOS", "mac"));
			header.appendChild(makeTabButton("Windows", "win"));
		}

		if (needsFixCopy) {
			// Disable copy button because of https://github.com/leaningtech/labs/issues/56
			figure.querySelector(".copy").style.display = "none";
			// TODO: actually fix copy
		}
	}

	function makeTabButton(label, osValue) {
		const button = document.createElement("button");
		button.classList.add("tab-button");
		button.innerText = label;
		button.addEventListener("click", () => {
			os = osValue;
			localStorage.setItem("os", os);
			update();
		});
		updateFuncs.push(() => {
			button.classList.toggle("is-active", os === osValue);
		});
		return button;
	}

	function update() {
		for (const updateFunc of updateFuncs) {
			updateFunc();
		}
	}

	update();
});
