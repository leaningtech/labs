// cheerpj.com/docs/llms.txt: the docs as a list of Markdown pages, in nav order
// (https://llmstxt.org). The theme writes each page's Markdown twin and
// llms-full.txt from this file after the build (markdown: true in astro.config).

import type { APIRoute } from "astro";
import { getRootNav, type NavEntry } from "@leaningtech/astro-theme/nav";

// Pages an agent can skip: listed under "## Optional", left out of llms-full.txt
const OPTIONAL = new Set(["copyright-notices"]);

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
			sections.push(
				`## ${entry.title}\n\n${files(entry.entries).map(line).join("\n")}`
			);
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

	const body = `# CheerpJ documentation

> CheerpJ is a WebAssembly Java Virtual Machine for the browser. It runs existing Java applications, applets, Java Web Start (JNLP) apps, Oracle Forms clients and libraries client-side, from unmodified JARs, with no local Java installation or plug-in.

Coding agents: load the CheerpJ skill first: ${origin}/skills/cheerpj/SKILL.md. Every page below is Markdown. All of them in one file: ${origin}/docs/llms-full.txt.

${sections.join("\n\n")}
`;
	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
