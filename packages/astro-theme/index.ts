import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import pagefind from "./pagefind";
import svelte from "@astrojs/svelte";
import prefetch from "@astrojs/prefetch";
import astroExpressiveCode, { loadShikiTheme } from "astro-expressive-code";
import remarkObsidianCallout from "remark-obsidian-callout";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
import { type AstroIntegration } from "astro";

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

export default function ThemeIntegration(): AstroIntegration {
	return {
		name: "@leaningtech/astro-theme",
		hooks: {
			"astro:config:setup": ({ updateConfig, injectRoute }) => {
				injectRoute({
					pattern: "blog",
					entrypoint: "@leaningtech/astro-theme/pages/blog/index.astro",
				});
				injectRoute({
					pattern: "blog/[...slug]",
					entrypoint: "@leaningtech/astro-theme/pages/blog/[...slug].astro",
				});
				injectRoute({
					pattern: "docs",
					entrypoint: "@leaningtech/astro-theme/pages/docs/index.astro",
				});
				injectRoute({
					pattern: "docs/[...slug]",
					entrypoint: "@leaningtech/astro-theme/pages/docs/[...slug].astro",
				});
				updateConfig({
					integrations: [
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
						prefetch({
							// Prefetch hovered internal links
							//intentSelector: ["a[href^='/']"],
						}),
					],
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
											src: "/icons/heading-link.svg",
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
											src: "/icons/external-link.svg",
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
				});
			},
		},
	};
}
