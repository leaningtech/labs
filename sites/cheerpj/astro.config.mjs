import { defineConfig } from "astro/config";
import icon from "astro-icon";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";
import { ExpressiveCodeTheme } from "astro-expressive-code";
import { readFileSync } from "node:fs";

const cheerpjTheme = ExpressiveCodeTheme.fromJSONString(
	readFileSync(new URL("./cheerpj-code-theme.jsonc", import.meta.url), "utf-8")
);

// https://astro.build/config
export default defineConfig({
	site: "https://cheerpj.com",
	base: "/docs/",
	integrations: [
		icon(),
		theme({
			baseIsDocs: true,
			theme: cheerpjTheme,
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
