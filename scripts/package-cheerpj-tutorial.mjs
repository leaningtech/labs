#!/usr/bin/env node

import { cp, mkdir, mkdtemp, readdir, readFile, stat, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));

if (args.help || !args.source || !args.output || !args.loaderUrl) {
	printUsage();
	process.exit(args.help ? 0 : 1);
}

const sourcePath = path.resolve(args.source);
const outputPath = path.resolve(args.output);
const placeholder = args.placeholder ?? "__CHEERPJ_LOADER_URL__";
const loaderUrlPattern =
	args.loaderUrlPattern ?? /https:\/\/cjrtnc\.leaningtech\.com\/[^"'`\s>]+\/loader\.js/g;

const sourceStat = await stat(sourcePath);
if (!sourceStat.isDirectory()) {
	throw new Error(`Source must be a directory: ${sourcePath}`);
}

const stagingPath = await mkdtemp(path.join(os.tmpdir(), "cheerpj-tutorial-"));
const packageRootPath = path.join(stagingPath, path.basename(sourcePath));

try {
	await cp(sourcePath, packageRootPath, { recursive: true });
	const removedJars = await removeEmptyJars(packageRootPath);
	const updatedHtmlFiles = await rewriteLoaderUrls(packageRootPath, {
		loaderUrl: args.loaderUrl,
		placeholder,
		loaderUrlPattern,
	});
	await rm(outputPath, { force: true });
	await zipDirectory(stagingPath, outputPath);

	console.log(`Packaged ${path.basename(sourcePath)} -> ${outputPath}`);
	console.log(`Removed ${removedJars.length} empty JAR(s)`);
	console.log(`Updated ${updatedHtmlFiles.length} HTML file(s)`);
	for (const filePath of removedJars) {
		console.log(`  removed jar: ${path.relative(packageRootPath, filePath)}`);
	}
	for (const filePath of updatedHtmlFiles) {
		console.log(`  updated html: ${path.relative(packageRootPath, filePath)}`);
	}
} finally {
	await rm(stagingPath, { recursive: true, force: true });
}

async function removeEmptyJars(rootPath) {
	const removed = [];
	for await (const filePath of walkFiles(rootPath)) {
		if (path.extname(filePath) !== ".jar") {
			continue;
		}
		const fileStat = await stat(filePath);
		if (fileStat.size === 0) {
			await rm(filePath, { force: true });
			removed.push(filePath);
		}
	}
	return removed;
}

async function rewriteLoaderUrls(rootPath, { loaderUrl, placeholder, loaderUrlPattern }) {
	const updated = [];
	for await (const filePath of walkFiles(rootPath)) {
		if (!isHtmlFile(filePath)) {
			continue;
		}
		const content = await readFile(filePath, "utf8");
		let nextContent = content;

		if (nextContent.includes(placeholder)) {
			nextContent = nextContent.split(placeholder).join(loaderUrl);
		}

		if (loaderUrlPattern.test(nextContent)) {
			nextContent = nextContent.replace(loaderUrlPattern, loaderUrl);
		}

		if (nextContent !== content) {
			await writeFile(filePath, nextContent);
			updated.push(filePath);
		}
		loaderUrlPattern.lastIndex = 0;
	}
	return updated;
}

async function zipDirectory(sourceDir, outputFile) {
	const outputParent = path.dirname(outputFile);
	await ensureDirectory(outputParent);

	const zipResult = spawnSync("zip", ["-qr", outputFile, "."], {
		cwd: sourceDir,
		encoding: "utf8",
	});

	if (zipResult.status !== 0) {
		throw new Error(
			`zip failed for ${sourceDir}: ${zipResult.stderr || zipResult.stdout || "unknown error"}`
		);
	}
}

async function ensureDirectory(dirPath) {
	await mkdir(dirPath, { recursive: true });
}

async function* walkFiles(rootPath) {
	const entries = await readdir(rootPath, { withFileTypes: true });
	for (const entry of entries) {
		const filePath = path.join(rootPath, entry.name);
		if (entry.isDirectory()) {
			yield* walkFiles(filePath);
			continue;
		}
		if (entry.isFile()) {
			yield filePath;
		}
	}
}

function isHtmlFile(filePath) {
	return [".html", ".htm"].includes(path.extname(filePath).toLowerCase());
}

function parseArgs(argv) {
	const result = {};
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (!argument.startsWith("--")) {
			continue;
		}
		const [key, inlineValue] = argument.slice(2).split("=", 2);
		if (key === "help") {
			result.help = true;
			continue;
		}
		const value = inlineValue ?? argv[index + 1];
		if (inlineValue === undefined) {
			index += 1;
		}
		result[toCamelCase(key)] = value;
	}
	return result;
}

function toCamelCase(value) {
	return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function printUsage() {
	console.log(`Usage:
  node scripts/package-cheerpj-tutorial.mjs \
    --source <example-folder> \
    --output <zip-file> \
    --loader-url <current-loader-url> [--placeholder __CHEERPJ_LOADER_URL__]

What it does:
  - copies the source example folder to a temp directory
  - removes zero-byte .jar files
  - replaces loader URL placeholders or existing CheerpJ loader URLs in HTML files
  - writes a zip file to the requested output path

Example:
  node scripts/package-cheerpj-tutorial.mjs \
    --source ../cheerpj-meta/examples/SwingSet3 \
    --output sites/cheerpj/public/cheerpj3/tutorials/swingset3-template.zip \
    --loader-url https://cjrtnc.leaningtech.com/4.3/loader.js
`);
}