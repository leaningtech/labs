---
title: Overview
description: The mental model for BrowserPod
---

Start here if you want a clear mental model of how BrowserPod works before diving into tutorials.

BrowserPod is a real Node.js runtime running inside the browser. The core concepts cover how the runtime boots, how it talks to a virtual OS layer, how files and processes behave, and how server traffic reaches the outside world.

### What these pages cover

- **Runtime model** — what a pod is and how the runtime is structured in the browser.
- **Pod lifecycle** — the boot sequence and why ordering matters.
- **Filesystem** — the virtual filesystem, persistence, and how processes see files.
- **Portals** — how in‑browser servers are exposed through public URLs.
- **Syscalls** — how Node’s OS calls are handled in the browser.
- **Cross‑origin isolation** — the browser security requirement that enables BrowserPod.

(Workers and tokens/usage are covered in their own pages.)

### Core concepts pages

- [What is a pod?](/docs/core-concepts/what-is-a-pod)
- [Filesystem](/docs/core-concepts/filesystem)
- [Portals](/docs/core-concepts/portals)
- [Syscalls](/docs/core-concepts/syscalls)
- [Cross‑origin isolation](/docs/core-concepts/cross-origin-isolation)
