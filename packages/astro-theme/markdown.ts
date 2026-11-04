// Markdown twins of the docs pages, for coding agents and other tools that
// read text rather than HTML.
//
// After the build, each docs page's <main> is converted to Markdown and written
// next to the page (getting-started/Java-app.html → getting-started/Java-app.md),
// and the page gets a <link rel="alternate" type="text/markdown"> to it.
// Converting the built HTML rather than the sources handles MDX components,
// replaced variables, callouts and code blocks the same way the reader sees them.
//
// The flip side: this depends on class names owned by other packages —
// `expressive-code` (code frames), `callout-title` / `callout-content`
// (remark-obsidian-callout), `data-pagefind-body` (pagefind). A major bump of
// any of them, or a move to another repo where versions re-resolve, can quietly
// degrade the output. After upgrading, check a page with code and a callout.
//
// If the site has an llms.txt (a page of the site, so it can follow the docs
// nav), llms-full.txt is written from it: every page it links to, in order,
// up to its "## Optional" section.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { type AstroIntegration } from "astro";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import { toText } from "hast-util-to-text";
import type { Element, ElementContent, Root, RootContent } from "hast";

type Node = Root | RootContent;

const DROP = new Set([
	"script",
	"style",
	"link",
	"button",
	"svg",
	"template",
	"noscript",
]);
// The icons the theme appends to headings and external links
const DECORATIVE_ICONS = /\/icons\/(heading-link|external-link)\.svg$/;

function el(
	tagName: string,
	children: ElementContent[],
	properties: Element["properties"] = {}
): Element {
	return { type: "element", tagName, properties, children };
}

function text(value: string): ElementContent {
	return { type: "text", value };
}

function classes(node: Element): string[] {
	const c = node.properties?.className;
	return Array.isArray(c) ? c.map(String) : [];
}

function find(node: Node, test: (e: Element) => boolean): Element | undefined {
	if (node.type === "element" && test(node)) return node;
	if ("children" in node) {
		for (const child of node.children) {
			const hit = find(child, test);
			if (hit) return hit;
		}
	}
	return undefined;
}

function findAll(node: Node, test: (e: Element) => boolean): Element[] {
	const hits: Element[] = [];
	(function walk(n: Node) {
		if (n.type === "element" && test(n)) hits.push(n);
		else if ("children" in n) n.children.forEach(walk);
	})(node);
	return hits;
}

const HEADING = /^h[1-6]$/;
const PHRASING = new Set([
	"a",
	"abbr",
	"b",
	"br",
	"code",
	"em",
	"i",
	"img",
	"kbd",
	"mark",
	"s",
	"small",
	"span",
	"strong",
	"sub",
	"sup",
	"u",
]);

/** Wraps loose inline content in a <p>, so it isn't lost or merged. */
function asFlow(children: ElementContent[]): ElementContent[] {
	const inline = children.every(
		(c) =>
			c.type === "text" ||
			c.type === "comment" ||
			(c.type === "element" && PHRASING.has(c.tagName))
	);
	return inline ? [el("p", children)] : children;
}

/** An Expressive Code frame → a plain <pre><code class="language-…">. */
function codeBlock(frame: Element): ElementContent[] {
	const pre = find(frame, (e) => e.tagName === "pre");
	if (!pre) return [];
	const lines = findAll(pre, (e) => classes(e).includes("ec-line"));
	const code = lines.length
		? lines.map((line) => toText(line, { whitespace: "pre" })).join("\n")
		: toText(pre, { whitespace: "pre" });
	const language = pre.properties?.dataLanguage;
	const title = find(frame, (e) => classes(e).includes("title"));
	const titleText = title ? toText(title).trim() : "";
	const block = el(
		"pre",
		[
			el("code", [text(code)], {
				className: language ? [`language-${language}`] : [],
			}),
		],
		{}
	);
	return titleText
		? [el("p", [el("code", [text(titleText)])]), block]
		: [block];
}

/**
 * A callout → a blockquote led by its bold title. Two markups: Markdown's
 * [!note] (remark-obsidian-callout: .callout-title-text, .callout-content)
 * and the MDX <Callout> component (.callout-title, then the content).
 */
function callout(quote: Element, ctx: Context): ElementContent[] {
	const titleBox = find(quote, (e) => classes(e).includes("callout-title"));
	const title =
		find(quote, (e) => classes(e).includes("callout-title-text")) ?? titleBox;
	// The content box holds only the first paragraph: anything after it is a
	// sibling of the box, so splice it in place rather than selecting it.
	const contentBox = find(quote, (e) => classes(e).includes("callout-content"));
	const content = quote.children.flatMap((c) =>
		c === titleBox ? [] : c === contentBox ? contentBox.children : [c]
	);
	const titleText = title ? toText(title).trim() : "";
	const body = asFlow(cleanAll(content, ctx));
	return [
		el("blockquote", [
			...(titleText ? [el("p", [el("strong", [text(titleText)])])] : []),
			...body,
		]),
	];
}

interface Context {
	pageUrl: URL;
	/** Pathnames of the pages that have a Markdown twin */
	markdownPaths: Set<string>;
}

function rewriteHref(href: string, ctx: Context): string {
	if (href.startsWith("#")) return href;
	let url: URL;
	try {
		url = new URL(href, ctx.pageUrl);
	} catch {
		return href;
	}
	if (url.origin === ctx.pageUrl.origin) {
		const path = url.pathname.replace(/\.html$/, "").replace(/\/$/, "");
		if (ctx.markdownPaths.has(path)) url.pathname = path + ".md";
	}
	return url.href;
}

function clean(node: ElementContent, ctx: Context): ElementContent[] {
	if (node.type !== "element") return node.type === "comment" ? [] : [node];
	const p = node.properties ?? {};
	const cls = classes(node);

	if (DROP.has(node.tagName)) return [];
	if (cls.includes("copy")) return [];
	// rehype-autolink-headings' anchor
	if (node.tagName === "a" && String(p.ariaHidden) === "true") return [];
	if (node.tagName === "img" && DECORATIVE_ICONS.test(String(p.src ?? "")))
		return [];

	if (cls.includes("expressive-code")) return codeBlock(node);
	if (node.tagName === "blockquote" && p.dataCallout !== undefined)
		return callout(node, ctx);

	const children = cleanAll(node.children, ctx);

	if (node.tagName === "details") return children;
	if (node.tagName === "summary") {
		const hasHeading = find(node, (e) => HEADING.test(e.tagName));
		return hasHeading ? children : [el("p", [el("strong", children)])];
	}
	if (node.tagName === "a") {
		// <a name="…"> anchors have no href: keep only what they wrap
		if (typeof p.href !== "string") return children;
		return [el("a", children, { href: rewriteHref(p.href, ctx) })];
	}
	if (node.tagName === "img") {
		const src = typeof p.src === "string" ? new URL(p.src, ctx.pageUrl) : null;
		return [el("img", [], { src: src?.href, alt: p.alt ?? "" })];
	}
	return [{ ...node, children }];
}

function cleanAll(nodes: ElementContent[], ctx: Context): ElementContent[] {
	return nodes.flatMap((n) => clean(n, ctx));
}

const toMarkdown = unified()
	.use(rehypeRemark)
	.use(remarkGfm)
	.use(remarkStringify, {
		bullet: "-",
		emphasis: "_",
		fences: true,
		listItemIndent: "one",
		rule: "-",
	});

function frontmatter(fields: Record<string, string | undefined>): string {
	const lines = Object.entries(fields)
		.filter(([, v]) => v)
		.map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
	return `---\n${lines.join("\n")}\n---\n\n`;
}

async function htmlFiles(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { recursive: true, withFileTypes: true });
	return entries
		.filter((e) => e.isFile() && e.name.endsWith(".html"))
		.map((e) => join(e.parentPath, e.name));
}

export default function markdown(): AstroIntegration {
	let site: URL;
	let base: string;
	return {
		name: "@leaningtech/astro-theme/markdown",
		hooks: {
			"astro:config:done": ({ config }) => {
				if (!config.site) throw new Error("markdown: `site` must be set");
				site = new URL(config.site);
				base = config.base.replace(/\/$/, "");
			},
			"astro:build:done": async ({ dir, logger }) => {
				const outDir = fileURLToPath(dir);
				const parse = unified().use(rehypeParse);

				// Pass 1: which pages are docs pages
				const pages: { file: string; path: string; html: string }[] = [];
				for (const file of await htmlFiles(outDir)) {
					const html = await readFile(file, "utf-8");
					if (!html.includes("data-pagefind-body")) continue;
					const rel = relative(outDir, file).split(sep).join("/");
					if (rel === "404.html") continue;
					const path = `${base}/${rel.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "")}`;
					pages.push({ file, path, html });
				}
				const markdownPaths = new Set(pages.map((p) => p.path));

				// Pass 2: write each twin and link it from its page
				for (const { file, path, html } of pages) {
					const tree = parse.parse(html);
					const main = find(
						tree,
						(e) => e.tagName === "main" && "dataPagefindBody" in e.properties
					);
					if (!main) continue;
					const pageUrl = new URL(path, site);
					const h1 = find(main, (e) => e.tagName === "h1");

					const body = cleanAll(main.children, { pageUrl, markdownPaths });
					const hast: Root = { type: "root", children: body };
					const mdast = await toMarkdown.run(hast);
					const md =
						// No description: the page's own follows the title in the body, and
						// the meta tag falls back to the product's on pages without one
						frontmatter({
							title: h1 ? toText(h1).trim() : undefined,
							source: pageUrl.href,
						}) + toMarkdown.stringify(mdast as never);

					await writeFile(file.replace(/\.html$/, ".md"), md);
					const link = `<link rel="alternate" type="text/markdown" href="${path}.md">`;
					await writeFile(file, html.replace("</head>", `${link}</head>`));
				}
				logger.info(`${pages.length} Markdown pages`);

				// llms-full.txt from llms.txt, when the site has one.
				// Assumes every .md link in it is a docs page written above. Once the
				// docs site merges into cheerpj.com, the root llms.txt will also list
				// marketing pages and the skill, which have no twin here: this will
				// need to skip links outside `base` rather than read them.
				let index: string;
				try {
					index = await readFile(join(outDir, "llms.txt"), "utf-8");
				} catch {
					return;
				}
				const required = index.split(/^## Optional\b/m)[0] ?? "";
				const parts: string[] = [];
				for (const [, href] of required.matchAll(/\]\(([^)\s]+\.md)\)/g)) {
					const url = new URL(href!, site);
					if (url.origin !== site.origin) continue;
					const rel = url.pathname.slice(base.length + 1);
					const md = await readFile(join(outDir, rel), "utf-8");
					parts.push(
						md.replace(/^---\n[\s\S]*?\n---\n\n/, `<!-- ${url.href} -->\n\n`)
					);
				}
				await writeFile(
					join(outDir, "llms-full.txt"),
					parts.join("\n\n---\n\n")
				);
				logger.info(`llms-full.txt: ${parts.length} pages`);
			},
		},
	};
}
