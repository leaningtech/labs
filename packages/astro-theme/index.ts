import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import robotsTxt from "astro-robots-txt";
import publicDir from "astro-public";
import pagefind from "./pagefind";
import markdown from "./markdown";
import { remarkReplaceVars, rehypeReplaceVars } from "./replace-variables";
import { rehypeBreakoutImages } from "./rehype-breakout-images";
import svelte from "@astrojs/svelte";
import astroExpressiveCode, {
	loadShikiTheme,
	ExpressiveCodeTheme,
} from "astro-expressive-code";
import remarkObsidianCallout from "remark-obsidian-callout";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import { type AstroIntegration } from "astro";
import { addIntegration } from "astro-integration-kit";
import { copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const prod = process.env.NODE_ENV === "production";

const dirname = import.meta.url.replace("file://", "").replace("/index.ts", "");

export type Options = {
	baseIsDocs?: boolean; // Only true for cheerpj site
	theme?: string | ExpressiveCodeTheme; // Shiki theme name, or a custom ExpressiveCodeTheme instance, defaults to material-theme-darker
	markdown?: boolean; // Write a Markdown twin of each docs page, and llms-full.txt from the site's llms.txt
};

// @astrojs/sitemap writes sitemap-index.xml (a <sitemapindex>) alongside
// sitemap-0.xml (the <urlset> holding the actual pages), but the root sitemap
// indexes of cheerpj.com and browserpod.io (leaningtech.com repo) — and the habit
// of most crawlers — ask for sitemap.xml. Copy the urlset there, not the index:
// both root sitemap.xml files are already a <sitemapindex>, and Google does not
// follow an index nested inside an index, so copying sitemap-index.xml would
// hide every docs URL.
//
// Only sitemap-0.xml is copied. Past 45,000 URLs @astrojs/sitemap splits into
// sitemap-1.xml and beyond, and this copy would cover just the first chunk; at that
// point the root index has to point at sitemap-index.xml instead.
//
// This is safe only while the docs are served from a subfolder (cheerpj.com/docs/):
// the copy lands at /docs/sitemap.xml, clear of the main site's own /sitemap.xml.
// When the docs merge into cheerpj.com, if they move to the site root this copy
// and the main site's sitemap.xml claim the same address and one silently wins.
// Drop this alias at that point, or rename the file.
function sitemapAlias(): AstroIntegration {
	return {
		name: "@leaningtech/astro-theme/sitemap-alias",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const urlset = new URL("sitemap-0.xml", dir);
				// @astrojs/sitemap only warns when it writes nothing (no `site` set, or
				// every page filtered out). Warn too, rather than failing the build.
				if (!existsSync(urlset)) {
					logger.warn(
						"no sitemap-0.xml was written, skipping the sitemap.xml copy"
					);
					return;
				}
				await copyFile(urlset, new URL("sitemap.xml", dir));
			},
		},
	};
}

export default function ThemeIntegration(
	options: Options = {}
): AstroIntegration {
	const base = options.baseIsDocs ? "/docs" : "";
	return {
		name: "@leaningtech/astro-theme",
		hooks: {
			"astro:config:setup": async (params) => {
				const theme =
					typeof options.theme === "string" || options.theme === undefined
						? await loadShikiTheme(options.theme ?? "material-theme-darker")
						: options.theme;
				theme.styleOverrides.frames = {
					editorBackground: "transparent",
					terminalBackground: "transparent",
					terminalTitlebarBackground: "transparent",
					terminalTitlebarBorderBottom: "transparent",
					editorTabBarBackground: "transparent",
					editorActiveTabBackground: "transparent",
					editorActiveTabBorderBottom: "transparent",
					shadowColor: "transparent",
				};

				const docsPrefix = options.baseIsDocs ? "" : "docs";
				// The docs index and the docs 404 both answer 200 without being a real page:
				// the index is a meta refresh (and a 301 on cheerpj.com) to the first docs
				// page, and /404 renders "page not found". Sitemaps list neither. Derived from
				// `base` and `docsPrefix` so it keeps working if a site changes its base.
				const docsRoot = `${base}/${docsPrefix}`.replace(/\/$/, "");
				const unlisted = new Set([
					docsRoot,
					`${docsRoot}/`,
					`${docsRoot}/404`,
					`${docsRoot}/404/`,
				]);

				const integrations = [
					astroExpressiveCode({
						theme,
						styleOverrides: {
							codeBackground: "transparent",
							borderColor: "rgb(41, 37, 36)", // border-stone-800
						},
					}),
					mdx(),
					sitemap({
						filter: (page) => !unlisted.has(new URL(page).pathname),
					}),
					sitemapAlias(), // must come after sitemap(): it copies its output
					// Only effective on sites served from their own domain root (labs, cheerp,
					// cheerpx). On cheerpj and browserpod the docs sit under /docs/, and crawlers
					// read robots.txt only at the domain root, so /docs/robots.txt, and the
					// Sitemap: line in it, is never fetched. Those two rely on the root domain's
					// robots.txt (another repo) pointing at the docs sitemap. When the docs merge
					// into the main site, move that line into the single root robots.txt and
					// drop this integration for the merged site.
					robotsTxt(),
					pagefind(),
					...(options.markdown ? [markdown()] : []),
					svelte(),
					publicDir({
						// FIXME claims directory does not exist
						dir: "public",
						cwd: dirname,
					}),
				];
				for (const integration of integrations) {
					addIntegration(params, { integration });
				}

				params.injectRoute({
					pattern: docsPrefix,
					entrypoint: "@leaningtech/astro-theme/pages/docs/index.astro",
				});
				params.injectRoute({
					pattern: `${docsPrefix}/404`,
					entrypoint: "@leaningtech/astro-theme/pages/docs/404.astro",
				});
				params.injectRoute({
					pattern: `${docsPrefix}/[...slug]`,
					entrypoint: "@leaningtech/astro-theme/pages/docs/[...slug].astro",
				});
				params.updateConfig({
					markdown: {
						remarkPlugins: [[remarkObsidianCallout, {}], remarkReplaceVars],
						rehypePlugins: [
							rehypeReplaceVars,
							rehypeBreakoutImages, // must run before rehypeExternalLinks adds its icon
							rehypeSlug, // astro does this automatically but rehype-autolink-headings needs it
							[
								rehypeAutolinkHeadings,
								{
									behavior: "append",
									content: {
										type: "element",
										tagName: "img",
										properties: {
											className:
												"not-prose inline-block align-middle heading-link-icon",
											style: "margin-left: 8px",
											src: base + "/icons/heading-link.svg",
											alt: "",
										},
										children: [],
									},
								},
							],
							[
								rehypeExternalLinks,
								{
									content: {
										type: "element",
										tagName: "img",
										properties: {
											className: "not-prose inline-block align-middle",
											style: "margin-left: 2px",
											src: base + "/icons/external-link.svg",
											alt: "",
										},
										children: [],
									},
									target: "_blank",
								},
							],
						],
					},
					compressHTML: prod,
					build: {
						format: "file",
						// Astro's default: only stylesheets under 4 KB are inlined. "always"
						// put about 109 KB of the same CSS before the content of every page,
						// downloaded again on each page; as a file it is fetched once and
						// cached, and agents reading raw HTML reach the content sooner.
						inlineStylesheets: "auto",
					},
					trailingSlash: "never",
					vite: {
						plugins: [tailwindcss()],
						ssr: {
							noExternal: [
								"@leaningtech/svelte-browserpod-editor",
								"svelte-codemirror-editor",
								"@iconify/svelte",
							],
						},
					},
				});
			},
		},
	};
}
