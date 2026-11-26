---
title: FAQ
description: "Answers to common BrowserPod questions about API keys, backend servers, COOP and COEP headers, native binaries, browser support, and security."
---

## What is BrowserPod?

BrowserPod is a microVM that runs in the browser. It boots a Linux-like kernel in WebAssembly, and on it runs Node.js, Rust and C++ applications, with Python in preview. Each Pod comes with a full command-line environment including `npm`, `pnpm`, `git` and `bash`. It has a local filesystem, which can persist across sessions, and reaches the internet through the browser's `fetch()` or through [BrowserPod Edge](/docs/understanding-browserpod/api-key), which adds inbound Portals and TCP. Everything runs on the user's own device, with zero latency.

Run it in the tab, and add [BrowserPod Edge](/docs/understanding-browserpod/api-key) when it needs the network.

## Do I need a backend server?

No. The Node.js server runs inside the browser. You only need to host the outer web app.

## Do I need an API key?

No. Without a key, a Pod boots on the free **fetch network**, which routes its traffic through the browser's `fetch()`, subject to CORS. With a key, it boots on the **Edge network**, which reaches its allowed domains and enables [Portals](/docs/understanding-browserpod/portals), which let you preview and share services running inside your Pod. See [Networking](/docs/understanding-browserpod/networking), including [using npm without an API key](/docs/understanding-browserpod/networking#using-npm-without-an-api-key).

## Is BrowserPod free?

Yes, for any use, including commercial use, under the [BrowserPod Community Licence](https://browserpod.io/license). The one condition is attribution: a visible "Powered by BrowserPod" credit linking to `https://browserpod.io` on the page that hosts the Pod. See [Licensing](/docs/more/licensing).

## What is metered?

Only [BrowserPod Edge](https://console.browserpod.io/login), the optional network service. Edge is billed in one-hour blocks of 10 tokens ($0.01): one block when the Pod connects, and another for each further hour, or part of an hour, that it stays connected. Edge Free includes 1,000 connected hours every month. Compute runs in your users' browsers and is never metered. A Pod on a fetch network costs nothing.

## Can I use BrowserPod without attribution?

Yes. Edge Pro ($20 a month) includes the BrowserPod Community Licence without attribution. For self-hosting, vendoring or redistribution, contact us about a BrowserPod Enterprise Licence.

## Can I self-host BrowserPod?

Self-hosting the runtime and disk images, vendoring them into your own build, and redistribution need a [BrowserPod Enterprise Licence](/docs/more/licensing#enterprise). Under the Community Licence, BrowserPod loads from our CDN.

## Will the runtime version I use stay available?

Yes. Each published runtime version is immutable and stays available, so an application pinned to a version keeps working. The only exception is a version with a critical security flaw, which may be withdrawn or blocked, with an upgrade path to a fixed version.

## Does BrowserPod send data to Leaning Technologies?

The runtime sends no telemetry. Your users' browsers download the runtime and disk images from our CDN, which receives the requests any web server does. See [Privacy for integrators](/docs/more/privacy-for-integrators).

## Why does BrowserPod need COOP and COEP headers?

BrowserPod uses `SharedArrayBuffer`, which requires cross-origin isolation. COOP and COEP headers enable that isolation.

## Do native binaries work?

Prebuilt native binaries from npm packages don't run directly. Use Wasm-compatible alternatives or `package.json` overrides when available (see the [native npm dependencies guide](/docs/guides/working-around-native-npm-dependencies)). If you're building your own program with Rust rather than depending on a prebuilt package, you can compile it directly to BrowserPod's Wasm target instead; see [Installing the Rust toolchain](/docs/guides/installing-rust-toolchain).

## Which browsers are supported?

Works on all major browsers, desktop and mobile: Chrome, Edge, Firefox and Safari 27+. Works best in Chromium-based browsers.

## Why is BrowserPod good for running untrusted code?

BrowserPod is designed for executing code in a sandboxed environment, whether that's user-provided scripts, AI-generated code, or dynamically loaded modules. It provides strong isolation through the browser's security sandbox, keeping execution local to the user's device while maintaining high fidelity with native environments.

## How does BrowserPod compare to cloud sandboxes?

BrowserPod runs on the user's device rather than provisioning cloud infrastructure for each session. This means:

- **No infrastructure**: There's no VM or container to provision. The user's device does the work.
- **Zero latency**: Programs run where the user is, with no network round trip.
- **Data stays on the device**: Code and files are never uploaded to run.
- **Real programs**: Pods run the real Node.js, compiled to WebAssembly, rather than a browser-specific reimplementation, along with Rust and C++ applications and a full command-line environment.

BrowserPod complements cloud sandboxes rather than replacing them: they stay the right choice for headless, long-running and GPU workloads.

## Does my code or data leave the device?

Your code and files stay on the device and are never uploaded to BrowserPod servers in order to run. The runtime and disk images are downloaded from our CDN, which receives the requests any website would. With BrowserPod Edge, a Pod's network traffic passes through our network service; the [Edge privacy policy](https://browserpod.io/browserpod-privacy) says exactly what it can see. See also [Privacy for integrators](/docs/more/privacy-for-integrators).

A Pod runs within the browser's security sandbox. Code running in a Pod cannot access the user's operating system, local files (unless explicitly provided), or other browser tabs.

## What is the performance like?

Pods start near-instantly, and there's zero latency: programs run on the user's device, with no network round trip. They run as WebAssembly on the browser's own engine, and each Pod is limited by the resources of the user's device.

## What are Portals?

Portals give a service running inside your Pod its own URL, so you can preview it and share it with others. BrowserPod creates the URL automatically when code listens on a port. Portals need [BrowserPod Edge](/docs/understanding-browserpod/api-key) (free tier available); see [Portals](/docs/understanding-browserpod/portals).
