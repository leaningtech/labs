import { defineConfig } from "astro/config";
import icon from "astro-icon";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

export default defineConfig({
	site: "https://cheerpx.io",
	integrations: [icon(), theme()],
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
