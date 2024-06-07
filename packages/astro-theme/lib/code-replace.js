const replacements = [
	[
		"%CHEERPX_LATEST%",
		() =>
			fetch("https://cheerpxdemos.leaningtech.com/publicdeploy/LATEST.txt")
				.then((r) => r.text())
				.then((s) => s.trim()),
	],
];

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
