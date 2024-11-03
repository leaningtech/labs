import "./callout.css";

function transition(cb) {
	if (document.startViewTransition) {
		document.startViewTransition(cb);
	} else {
		cb();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const callouts = document.querySelectorAll(
		"blockquote[data-callout][data-expandable=true]"
	);
	for (const callout of callouts) {
		const title = callout.querySelector(".callout-title");

		// Add caret svg icon
		title.innerHTML += `<svg class="callout-caret" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/></svg>`;

		// Make expandable
		title.addEventListener("click", () => {
			const { dataset } = callout;
			transition(() => {
				if (dataset.expanded === "true") {
					dataset.expanded = "false";
				} else {
					dataset.expanded = "true";
				}
			});
		});
	}
});
