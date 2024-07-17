import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import publicDir from "astro-public";
import pagefind from "./pagefind";
import svelte from "@astrojs/svelte";
import astroExpressiveCode, { loadShikiTheme } from "astro-expressive-code";
import remarkObsidianCallout from "remark-obsidian-callout";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import { type AstroIntegration } from "astro";
import { addIntegration } from "astro-integration-kit";
import { squooshImageService } from "astro/config";

const prod = process.env.NODE_ENV === "production";

const theme = await loadShikiTheme("material-theme-darker");
theme.styleOverrides.frames = {
	editorBackground: "transparent",
	codeBackground: "transparent",
	terminalBackground: "transparent",
	terminalTitlebarBackground: "transparent",
	terminalTitlebarBorderBottom: "transparent",
	editorTabBarBackground: "transparent",
	editorActiveTabBackground: "transparent",
	editorActiveTabBorderBottom: "transparent",
	shadowColor: "transparent",
};

const dirname = import.meta.url.replace("file://", "").replace("/index.ts", "");

export type Options = {
	baseIsDocs?: boolean; // Only true for cheerpj site
};

export default function ThemeIntegration(
	options: Options = {},
): AstroIntegration {
	const base = options.baseIsDocs ? "/docs" : "";
	return {
		name: "@leaningtech/astro-theme",
		hooks: {
			"astro:config:setup": (params) => {
				const integrations = [
					astroExpressiveCode({
						theme,
						styleOverrides: {
							codeBackground: "transparent",
							borderColor: "rgb(41, 37, 36)", // border-stone-800
							// doesn't work?
							frames: {},
						},
					}),
					mdx(),
					sitemap(),
					tailwind(),
					robotsTxt(),
					pagefind(),
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
					pattern: "blog",
					entrypoint: "@leaningtech/astro-theme/pages/blog/index.astro",
				});
				params.injectRoute({
					pattern: "blog/[...slug]",
					entrypoint: "@leaningtech/astro-theme/pages/blog/[...slug].astro",
				});

				const docsPrefix = options.baseIsDocs ? "" : "docs";
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
						remarkPlugins: [[remarkObsidianCallout, {}]],
						rehypePlugins: [
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
						inlineStylesheets: "always",
					},
					trailingSlash: "never",
					image: {
						service: squooshImageService(),
					},
				});
			},
		},
	};
}
