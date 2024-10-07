const replacements = [];

document.addEventListener("DOMContentLoaded", () => {
	const spans = document.querySelectorAll(".expressive-code code span");

	for (const span of spans) {
		for (const [search, replace] of replacements) {
			if (span.innerText.includes(search)) {
				replace().then((s) => {
					span.innerText = span.innerText.replace(search, s);
				});
			}
		}
	}
});
