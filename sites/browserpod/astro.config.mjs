import { defineConfig } from "astro/config";
import icon from "astro-icon";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

// https://astro.build/config
export default defineConfig({
	site: "https://browserpod.io",
	base: "/docs",
	integrations: [
		icon(),
		theme({
			baseIsDocs: true,
		}),
	],
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
