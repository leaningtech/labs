import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import pagefind from "astro-pagefind";

const prod = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
	site: "https://labs.leaningtech.com",
	integrations: [
		mdx(),
		sitemap(),
		tailwind(),
		robotsTxt({
			policy: [
				{
					userAgent: "*",
					disallow: "/",
				},
			],
		}), // TODO: remove policy when we're ready to go live
		pagefind(),
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
