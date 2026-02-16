---
title: FAQ
description: Common questions about BrowserPod
---
## What is BrowserPod?

BrowserPod runs real Node.js applications inside the browser using WebAssembly. It provides a virtual filesystem and a portal system to expose local servers via public URLs.

## Do I need a backend server?

No. The Node.js server runs inside the browser. You only need to host the outer web app.

## Do I need an API key?

Yes. `BrowserPod.boot` requires an API key.

## Why does BrowserPod need COOP and COEP headers?

BrowserPod uses `SharedArrayBuffer`, which requires cross-origin isolation. COOP and COEP headers enable that isolation.

## Do native binaries work?

Not directly. Use Wasm-compatible alternatives or `package.json` overrides when available.

## Which browsers are supported?

All the major browsers on desktop and mobile (Chrome, Edge, Firefox, Safari) are supported.

