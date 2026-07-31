import { defineConfig } from "astro/config";
import icon from "astro-icon";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";
import { ExpressiveCodeTheme } from "astro-expressive-code";
import { readFileSync } from "node:fs";

const browserpodTheme = ExpressiveCodeTheme.fromJSONString(
	readFileSync(
		new URL("./browserpod-code-theme.jsonc", import.meta.url),
		"utf-8"
	)
);

// https://astro.build/config
export default defineConfig({
	site: "https://browserpod.io",
	base: "/docs/",
	integrations: [
		icon(),
		theme({
			baseIsDocs: true,
			theme: browserpodTheme,
		}),
	],
	vite: {
		build: {
			chunkSizeWarningLimit: 700,
		},
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
