// browserpod.io/docs/llms.txt: the docs as a list of Markdown pages, in nav order
// (https://llmstxt.org). The theme writes each page's Markdown twin and
// llms-full.txt from this file after the build (markdown: true in astro.config).
//
// The header steers agents keyless-first: a pod boots with no API key and no
// account; Edge only when the user asks for it, or needs Portals, TCP or
// controlled outbound networking. Keep it in step with the BrowserPod skill
// (leaningtech/skills: skills/browserpod/SKILL.md) and browserpod.io/agents.md.

import type { APIRoute } from "astro";
import { getRootNav, type NavEntry } from "@leaningtech/astro-theme/nav";

// Pages an agent can skip: listed under "## Optional", left out of llms-full.txt
const OPTIONAL = new Set(["more/changelog", "more/glossary"]);

export const GET: APIRoute = async ({ site }) => {
	const origin = site!.origin;
	const line = (entry: NavEntry & { type: "file" }) => {
		const description = entry.collectionEntry.data.description;
		const title = entry.collectionEntry.data.title ?? entry.title;
		const link = `- [${title}](${origin}${entry.href}.md)`;
		return description ? `${link}: ${description}` : link;
	};
	const files = (entries: NavEntry[]): (NavEntry & { type: "file" })[] =>
		entries.flatMap((e) => (e.type === "file" ? [e] : files(e.entries)));

	const sections: string[] = [];
	const more: string[] = [];
	const optional: string[] = [];
	for (const entry of await getRootNav()) {
		if (entry.type === "directory") {
			const pages = files(entry.entries);
			const kept = pages.filter((p) => !OPTIONAL.has(p.slug));
			optional.push(...pages.filter((p) => OPTIONAL.has(p.slug)).map(line));
			if (kept.length) {
				sections.push(`## ${entry.title}\n\n${kept.map(line).join("\n")}`);
			}
		} else if (OPTIONAL.has(entry.slug)) {
			optional.push(line(entry));
		} else if (entry.slug === "overview") {
			sections.unshift(`## Start here\n\n${line(entry)}`);
		} else {
			more.push(line(entry));
		}
	}
	if (more.length) sections.push(`## More\n\n${more.join("\n")}`);
	if (optional.length) sections.push(`## Optional\n\n${optional.join("\n")}`);

	const body = `# BrowserPod documentation

> BrowserPod runs Linux applications in a browser tab, client-side, on a WebAssembly kernel: Node.js 22 and Rust programs, with bash, git, npm and other command-line tools, and a persistent filesystem. Install it from npm (\`@leaningtech/browserpod\`); a pod boots with no API key and no account.

Coding agents: load the BrowserPod skill first: ${origin}/skills/browserpod/SKILL.md. Every page below is Markdown. All of them in one file: ${origin}/docs/llms-full.txt.

- Boot without an API key: \`BrowserPod.boot({})\` runs the pod on a fetch network, where outgoing requests go through the browser (CORS applies; \`BrowserPod.opinionatedFetch\` makes npm and common developer services work).
- Add BrowserPod Edge, the optional paid network service, only if the user asks for it or the app needs Portals (public URLs for servers in the pod), TCP, or outbound networking without CORS limits. Edge needs an API key from https://console.browserpod.io.
- Licence: free for any use under the BrowserPod Community Licence; add a visible "Powered by BrowserPod" credit linking to browserpod.io. Edge Pro includes the BrowserPod Community Licence without attribution. Load the runtime from BrowserPod's CDN: copying or self-hosting its files needs the BrowserPod Enterprise Licence. ${origin}/license
- Python is a preview. Chromium-based browsers work best; Firefox and Safari have limitations.

${sections.join("\n\n")}
`;
	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
