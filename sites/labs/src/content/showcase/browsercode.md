---
title: BrowserCode
description: A web-based IDE and AI coding agent playground that works entirely inside your browser tab.
demo_url: https://browsercode.io
repository_url: https://github.com/leaningtech/browsercode
author: Leaning Technologies
project_type:
  - Dev Tools
  - Tech Demo
niche: IDE
tags:
  - BrowserPod
score: 95
hero_image: "./browsercode.png"
hide_hero: true
---

<iframe
	src="https://browsercode.io/embed?framework=vite&view=files,editor,terminal,preview"
	allow="cross-origin-isolated"
	title="BrowserCode running a Vite template"
	class="border border-stone-700 rounded-md w-full h-[40rem]"
></iframe>

BrowserCode is a browser-based development environment for prototyping and sharing full-stack apps. It runs entirely on your device: there is no account to create, nothing to install and no server doing the work. You open a tab and get a file tree, a code editor, search, a real terminal, and a live preview pane.

It is built on [BrowserPod](https://browserpod.io), a microVM that runs in the browser, built on WebAssembly. The editor above is a live BrowserCode embed: change a file and the preview updates.

## What you can do with it

- **Start from a template.** Vite, React, Svelte, Vue, Next.js, Nuxt and Express. Dependencies install with pnpm inside the sandbox, the dev server starts in the terminal, and hot reload works as it does locally.
- **Run AI coding agents.** Claude Code, Codex CLI and Pi run unmodified in the browser, with Antigravity and OpenCode coming soon. You sign in with your own account or API key, which stays in your browser. The agent can read your project, run commands, and start servers, all within the sandbox.
- **Share a live preview.** A server started inside the sandbox is exposed through a BrowserPod [Portal](https://browserpod.io/docs/understanding-browserpod/portals), a public URL that routes traffic to your tab. Open it on your phone or send it to a colleague without deploying anything.
- **Write Java.** A Java playground compiles and runs code in the tab with [CheerpJ](https://cheerpj.com), including Swing applications.

## How it works

Each project runs in a BrowserPod sandbox: Node.js on BrowserPod (Rust and Python in preview) and Java on CheerpJ, all compiled to WebAssembly. The sandbox provides a POSIX-like filesystem and command line tools including `bash`, `git`, `npm`, `pnpm`, `curl`, `ripgrep` and `fd`. Outbound networking is limited to an allowlist covering the npm registry, Yarn, GitHub and the major AI provider APIs.

Everything is isolated from your operating system by the browser's own security model. If an agent breaks something, it breaks it in a tab. The [BrowserPod deep dive](/blog/browserpod-deep-dive) covers the architecture in detail.

## Learn more

Try it at [browsercode.io](https://browsercode.io), read the [launch announcement](/blog/announcing-browsercode), or run your own copy from the [source on GitHub](https://github.com/leaningtech/browsercode) with a BrowserPod API key.
