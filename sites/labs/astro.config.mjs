import { defineConfig } from "astro/config";
import icon from "astro-icon";
import theme from "@leaningtech/astro-theme";
import { resolve } from "node:path";

// https://astro.build/config
export default defineConfig({
	site: "https://labs.leaningtech.com",
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
		plugins: [
			{
				name: "cross-origin-isolation",
				configureServer(server) {
					server.middlewares.use((_req, res, next) => {
						res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
						res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
						next();
					});
				},
			},
		],
		optimizeDeps: {
			esbuildOptions: {
				target: "es2022",
			},
		},
	},
});
