import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],
	resolve: {
		// Forcing Vite to bundle only one codemirror instance, else pnpm symlinks have a chance of linking twice, causing a singleton error
		dedupe: [
			"@codemirror/state",
			"@codemirror/view",
			"@codemirror/language",
			"@codemirror/commands",
		],
	},
});
