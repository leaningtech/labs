import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import pagefind from "./pagefind.mjs";
import svelte from "@astrojs/svelte";
import prefetch from "@astrojs/prefetch";
import astroExpressiveCode from "astro-expressive-code";
import remarkObsidianCallout from "remark-obsidian-callout";
import { resolve } from "node:path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";

const prod = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
	site: "https://labs.leaningtech.com",
	integrations: [
		astroExpressiveCode(),
		mdx(),
		sitemap(),
		tailwind(),
		robotsTxt(),
		pagefind(),
		svelte(),
		prefetch({
			// Prefetch hovered internal links
			intentSelector: ["a[href^='/']"],
		}),
	],
	markdown: {
		shikiConfig: {
			theme: "dracula",
		},
		remarkPlugins: [
			[
				remarkObsidianCallout,
				{
					blockquoteClass: "not-prose",
				},
			],
		],
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
	vite: {
		resolve: {
			alias: [
				{
					find: "@",
					replacement: resolve("./src/"),
				},
			],
		},
	},
});
