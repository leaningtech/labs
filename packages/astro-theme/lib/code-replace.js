const replacements = [
	{ name: "%CX_LATEST%", value: "1.1.5" },
	{ name: "%BP_LATEST%", value: "1.0" },
];

document.addEventListener("DOMContentLoaded", () => {
	const spans = document.querySelectorAll(".expressive-code code span");

	for (const {name, value} of replacements) {
		for (const span of spans) {
			if (span.innerText.includes(name)) {
				Promise.resolve(value).then((s) => {
					span.innerHTML = span.innerHTML.replace(name, s);
				});
			}
		}
		const badge = document.querySelectorAll(`img[src*='${name}']`);
		badge.forEach((img) => {
			const newSrc = img.src.replace(name, value);
			img.src = newSrc;
		});
	}

});

// Function to update data-code before button click
function updateDataCode() {
	// Find button with data-code attribute (``` copy button)
	document.querySelectorAll("[data-code]").forEach((btn) => {
		let replacedCode = btn.dataset.code;
		for (const {name, value} of replacements) {
			// Replace the placeholders
			replacedCode = replacedCode.replace(new RegExp(`${name}/g`), value);
		}
		// Update the button's data-code attribute with the modified data
		btn.dataset.code = replacedCode;
	});
}

// When page loads, call the function to update the code blocks
window.addEventListener("DOMContentLoaded", updateDataCode);
