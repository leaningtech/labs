import { defineConfig } from "astro/config";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

export default defineConfig({
	site: "https://cheerpj.com",
	base: "/docs",
	integrations: [theme({ baseIsDocs: true })],
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
