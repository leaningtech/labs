import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import pagefind from "astro-pagefind";
import svelte from "@astrojs/svelte";
const prod = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
	site: "https://labs.leaningtech.com",
	integrations: [
		mdx(),
		sitemap(),
		tailwind(),
		robotsTxt(),
		pagefind(),
		svelte(),
	],
	markdown: {
		shikiConfig: {
			theme: "dracula",
		},
	},
	compressHTML: prod,
	build: {
		format: "file",
	},
	trailingSlash: "never",
});
