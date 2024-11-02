import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				dev: process.env.NODE_ENV !== "production",
				hydratable: true,
			},
		}),
	],
	build: {
		lib: {
			formats: ["es"],
			entry: resolve(__dirname, "src/index.js"),
			fileName: "global-navbar",
		},
	},
});
