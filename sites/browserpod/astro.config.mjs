import { defineConfig } from "astro/config";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

// https://astro.build/config
export default defineConfig({
	site: "https://browserpod.io",
	base: "/docs",
	integrations: [
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
