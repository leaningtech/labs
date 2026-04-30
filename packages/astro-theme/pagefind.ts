// Astro pagefind integration.
// Combination of shishkin/astro-pagefind (outdated) and withastro/starlight.

import { spawn } from "node:child_process";
import { dirname, join, relative } from "node:path";
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
					etag: true,
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
					const pagefindBin =
						process.platform === "win32"
							? join(cwd, "node_modules", ".bin", "pagefind.cmd")
							: join(cwd, "node_modules", ".bin", "pagefind");

					spawn(pagefindBin, ["--site", outDir], {
						stdio: "inherit",
						shell: true,
						cwd,
					}).on("close", () => resolve());
				});
			},
		},
	};
}
