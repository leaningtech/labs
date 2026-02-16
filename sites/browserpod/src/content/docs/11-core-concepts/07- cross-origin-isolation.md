---
title: Understanding cross-origin isolation
description: Why BrowserPod requires COOP and COEP
---

BrowserPod uses `SharedArrayBuffer`, which modern browsers only enable on **cross‑origin isolated** pages. Cross‑origin isolation is a browser security mode that protects users from data leaks between tabs and embedded resources.

To enable it, your page must send **both** of these headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

When these headers are present, the browser allows `SharedArrayBuffer` and BrowserPod can boot. When they are missing, the browser blocks `SharedArrayBuffer` and the pod fails to start.

Cross‑origin isolation is a browser‑level requirement. It applies regardless of framework or hosting provider. Localhost is the only exception where browsers allow it over HTTP; in production, it requires HTTPS.

If you want configuration examples, see [Set CORS and COOP headers](/docs/guides/hosting).
