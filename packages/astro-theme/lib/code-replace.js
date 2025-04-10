let CX_LATEST = "1.1.2";

const replacements = [
	[
		"%CX_LATEST%",
		() => {
			return Promise.resolve(CX_LATEST);
		},
	],
];

document.addEventListener("DOMContentLoaded", () => {
	const spans = document.querySelectorAll(".expressive-code code span");

	for (const span of spans) {
		for (const [search, replace] of replacements) {
			if (span.innerText.includes(search)) {
				replace().then((s) => {
					span.innerHTML = span.innerHTML.replace(search, s);
				});
			}
		}
	}

	const badge = document.querySelectorAll("img[src*='%CX_LATEST%']");
	badge.forEach((img) => {
		const newSrc = img.src.replace("%CX_LATEST%", CX_LATEST);
		img.src = newSrc;
	});
});

// Function to update data-code before button click
function updateDataCode() {
	// Find button with data-code attribute (``` copy button)
	document.querySelectorAll("[data-code]").forEach((btn) => {
		let originalCode = btn.dataset.code;

		// Replace the placeholder %CX_LATEST% with the newest versions of CX
		let replacedCode = originalCode.replace(/%CX_LATEST%/g, CX_LATEST);

		// Update the button's data-code attribute with the modified data
		btn.dataset.code = replacedCode;
	});
}

// When page loads, call the function to update the code blocks
window.addEventListener("DOMContentLoaded", updateDataCode);
