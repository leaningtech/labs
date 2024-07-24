import { defineConfig } from "astro/config";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

// https://astro.build/config
export default defineConfig({
	site: "https://cheerpj.com",
	base: "/docs",
	integrations: [
		theme({
			baseIsDocs: true,
		}),
	],
	i18n: {
		defaultLocale: "en",
		locales: ["en", "ja"],
		fallback: {
			ja: "en",
		},
	},
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
