import { defineConfig } from "astro/config";
import icon from "astro-icon";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

// https://astro.build/config
export default defineConfig({
	site: "https://cheerpj.com",
	base: "/docs/",
	integrations: [
		icon(),
		theme({
			baseIsDocs: true,
		}),
	],
	i18n: {
		defaultLocale: "en",
		locales: ["en", "ja", "zh"],
		fallback: {
			ja: "en",
			zh: "en",
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
