---
title: WebAssembly
description: How Wasm enables BrowserPod to run Node.js in the browser
---

## WebAssembly

WebAssembly (Wasm) is a binary format that browsers can execute directly, alongside JavaScript. It is not a programming language and it isn’t “compiled JavaScript”; it is closer to safe, portable machine code that the browser knows how to run. The point of Wasm is to let compiled software run fast in the browser without rewriting it in JS. It still runs inside the browser’s security sandbox because everything in a page does.

## Node runtime wiring

BrowserPod uses Wasm to run the Node.js runtime itself in the browser. Most of Node is written in C and C++, so BrowserPod compiles that native code into a Wasm module that the browser can load and execute. The missing piece is the operating system layer that Node normally talks to for files, networking, and timers. In BrowserPod, that role is filled by CheerpOS, which provides a Linux-like syscall interface. So when Node asks to open a file or listen on a port, those requests are handled by CheerpOS inside the browser sandbox, not by your actual operating system.

## Environment boundaries

This setup is why BrowserPod behaves like real Node instead of a JavaScript reimplementation. The Node APIs you call end up as syscalls, and CheerpOS can satisfy those inside the browser. It also sets clear expectations for how the environment behaves: files live in a virtual filesystem, servers are exposed through BrowserPod portals, and native binaries require Wasm‑compatible alternatives. These are the natural characteristics of running a server runtime inside a browser.

## JavaScript boundary

One more piece that matters is how Wasm interacts with JavaScript. Wasm cannot touch the DOM or the browser APIs directly; it can only work with the inputs the host gives it. BrowserPod uses this boundary intentionally: Node runs in Wasm, while your UI still lives in normal JavaScript. That separation keeps the runtime fast and safe, and it’s why your app code can combine a real Node backend running in the browser with a regular front‑end UI.
