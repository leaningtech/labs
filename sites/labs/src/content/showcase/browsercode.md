---
title: BrowserCode
description: Run AI coding agents like Claude Code and Gemini CLI directly in your browser — no installation required, fully client-side.
demo_url: https://browsercode.io/claude
repository_url: https://github.com/leaningtech/browsercode
author: Leaning Technologies
project_type:
  - Dev Tools
  - Tech Demo
niche: AI Sandbox
tags:
  - BrowserPod
score: 95
hero_image: "./browsercode.png"
---

BrowserCode is a browser-based runtime for AI coding agents, built on top of BrowserPod. It brings tools like Claude Code and Gemini CLI entirely into the browser — no local installation, no setup, no native dependencies.

Under the hood, BrowserCode runs Node.js v22 via WebAssembly, paired with a POSIX-like filesystem, Bash, Git, and npm — all sandboxed inside the browser. The result is a fully functional development environment that launches instantly and is isolated from your operating system by the browser's own security model.

Any port bound to a public interface inside the pod is exposed to the internet through BrowserPod's portal, giving you live previews accessible from any device via a shareable URL. This makes it easy to test your application on mobile, share early previews with clients, or demonstrate a project without setting up any hosting.

BrowserCode currently supports Claude Code and Gemini CLI in beta, with Codex CLI and OpenCode coming soon. It is compatible with popular frameworks including Express.js, Svelte, Next.js, Nuxt, and React.

Learn more at [browsercode.io](https://browsercode.io) or explore the [documentation](https://browserpod.io/docs/overview).
