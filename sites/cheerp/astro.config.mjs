import { defineConfig } from "astro/config";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

export default defineConfig({
	site: "https://cheerp.io",
	integrations: [theme()],
	vite: {
		resolve: {
			alias: [
				{
					find: "@",
					replacement: resolve("./src/")
				}
			]
		}
	}
});
