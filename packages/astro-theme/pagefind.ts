// Astro pagefind integration.
// Combination of shishkin/astro-pagefind (outdated) and withastro/starlight.

import { spawn } from "node:child_process";
import { dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";
import { type AstroIntegration } from "astro";

export default function pagefind(): AstroIntegration {
	let outDir: string;
	let cwd: string;
	return {
		name: "Pagefind",
		hooks: {
			"astro:config:setup": ({ config }) => {
				const targetDir = fileURLToPath(config.outDir);
				cwd = dirname(fileURLToPath(import.meta.url));
				outDir = relative(cwd, targetDir);
			},
			"astro:server:setup": ({ server }) => {
				const serve = sirv(outDir, {
					dev: true,
					etag: true
				});
				server.middlewares.use((req, res, next) => {
					if (req.url?.startsWith("/pagefind/")) {
						serve(req, res, next);
					} else {
						next();
					}
				});
			},
			"astro:build:done": () => {
				return new Promise((resolve) => {
					spawn("npx", ["-y", "pagefind", "--site", outDir], {
						stdio: "inherit",
						shell: true,
						cwd
					}).on("close", () => resolve());
				});
			}
		}
	};
}
