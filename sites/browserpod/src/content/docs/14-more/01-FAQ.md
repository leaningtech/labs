---
title: FAQ
description: "Answers to common BrowserPod questions about API keys, backend servers, COOP and COEP headers, native binaries, browser support, and security."
---

## What is BrowserPod?

BrowserPod is a universal execution layer for browser-based compute. It provides a sandboxed runtime API for running code safely inside the browser using WebAssembly—whether that's for web-based IDEs, interactive documentation, untrusted code execution, or education. It includes a Linux-compliant environment with a virtual filesystem, process isolation, and Portals for controlled networking.

## Do I need a backend server?

No. The Node.js server runs inside the browser. You only need to host the outer web app.

## Do I need an API key?

Not always. `BrowserPod.boot` works without one: the Pod boots on a free **fetch network** that routes its traffic through the browser with `fetch()`, subject to CORS. An API key is required for an **edge network**, which reaches any domain permitted by your key and enables [Portals](/docs/understanding-browserpod/portals). See [Networking](/docs/understanding-browserpod/networking).

## Is BrowserPod free?

Yes, for any use, including commercial use, under the [BrowserPod Community Licence](https://browserpod.io/license). The one condition is attribution: a visible "Powered by BrowserPod" credit linking to `https://browserpod.io` on the page that hosts the Pod. See [Licensing](/docs/more/licensing).

## What is metered?

Only BrowserPod Edge, the optional network service. Edge is charged in one-hour blocks of 10 tokens ($0.01): one block when the Pod connects, and another for each further hour, or part of an hour, that it stays connected. Edge Free includes 1,000 connected hours every month. Compute runs in your users' browsers and is never metered. A Pod on a fetch network costs nothing.

## Can I use BrowserPod without attribution?

Yes, with a commercial licence. Edge Pro ($20 a month) includes a commercial licence to use BrowserPod without attribution, and Enterprise agreements can include one too.

## Can I self-host BrowserPod?

Self-hosting the runtime and disk images, vendoring them into your own build, and redistribution need an [Enterprise licence](/docs/more/licensing#enterprise). Under the Community Licence, BrowserPod loads from our CDN.

## Will the runtime version I use stay available?

Yes. Each published runtime version is immutable and stays available, so an application pinned to a version keeps working. The only exception is a version with a critical security flaw, which may be withdrawn or blocked, with an upgrade path to a fixed version.

## Does BrowserPod send data to Leaning Technologies?

The runtime sends no telemetry. Your users' browsers download the runtime and disk images from our CDN, which receives the requests any web server does. See [Privacy for integrators](/docs/more/privacy-for-integrators).

## Why does BrowserPod need COOP and COEP headers?

BrowserPod uses `SharedArrayBuffer`, which requires cross-origin isolation. COOP and COEP headers enable that isolation.

## Do native binaries work?

Prebuilt native binaries from npm packages don't run directly. Use Wasm-compatible alternatives or `package.json` overrides when available (see the [native npm dependencies guide](/docs/guides/working-around-native-npm-dependencies)). If you're building your own program with Rust rather than depending on a prebuilt package, you can compile it directly to BrowserPod's Wasm target instead; see [Installing the Rust toolchain](/docs/guides/installing-rust-toolchain).

## Which browsers are supported?

All the major browsers on desktop and mobile (Chrome, Edge, Firefox, Safari) are supported.

## Why is BrowserPod good for running untrusted code?

BrowserPod is designed for executing code in a sandboxed environment, whether that's user-provided scripts, AI-generated code, or dynamically loaded modules. It provides strong isolation through the browser's security sandbox, keeping execution local to the user's device while maintaining high fidelity with native environments.

## How does BrowserPod compare to cloud sandboxes?

BrowserPod runs on the user's device rather than provisioning cloud infrastructure for each session. This means:

- **Lower cost**: No per-session VM costs. Computation uses underutilized client resources.
- **Lower latency**: No cold starts or network round trips to remote servers.
- **Better data locality**: User inputs and code execution stay in the browser by default, reducing your attack surface and compliance requirements.
- **High fidelity**: BrowserPod provides a full Linux-compliant syscall interface with complete POSIX filesystem semantics, real process isolation, and true multi-threading. It runs complete, unmodified runtime engines (like the full Node.js) that behave identically to their native counterparts, rather than browser-specific reimplementations.
- **Multi-language support**: Unlike solutions built for a single runtime, BrowserPod is designed from the ground up as a language-agnostic platform. It already supports **Node.js** and **Rust**, with **Python**, **Ruby**, **Go**, and eventually full Linux containers.

## Is my data secure in BrowserPod?

Yes. BrowserPod runs entirely within the browser's security sandbox, which is battle-tested and continuously hardened by browser vendors. Code running in a Pod cannot access the user's operating system, local files (unless explicitly provided), or other browser tabs. Data stays on the user's device by default unless your application specifically transmits it elsewhere.

## What is the performance like?

BrowserPod uses WebAssembly to run runtime engines at near-native speed. It supports real multi-process workloads with true concurrency via WebWorkers. Performance is suitable for computationally heavy tasks, including development tools, build pipelines, package managers, and code execution workflows.

## What are Portals?

Portals are BrowserPod's controlled networking feature. When code inside a Pod listens on a port, BrowserPod automatically creates a secure, shareable URL that routes traffic to that service. This enables live previews, interactive demos, and collaborative workflows without provisioning dedicated backend infrastructure.
