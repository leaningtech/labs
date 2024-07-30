---
title: WebVM
description: Linux running in the browser
image: ./webvm.png
url: https://webvm.io/
sourceCode: https://github.com/leaningtech/webvm
tags:
 - CheerpX
pubDate: 2024-01-01
---

WebVM is a server-less virtual Linux environment running fully client-side in HTML5/WebAssembly. 

## Features

- [CheerpX](https://cheerpx.io/)
- [Xterm.js](https://xtermjs.org/)
- Networking via [Tailscale](https://cheerpx.io/blog/mini-webvm-your-linux-box-from-dockerfile-via-wasm)
- Debian buster disk image

WebVM is effectively server-less and has no *active* server-side component. The disk image is distributed over a CDN to maximize scalability. All users access the same disk image from the CDN, with their individual changes being preserved locally to the browser. This means that we could support even millions of concurrent users with minimal costs and resources.

## Deploy Your Own

You can deploy your own version of WebVM by simply forking the repository on GitHub and editing the included Dockerfile. A GitHub Actions workflow will automatically deploy it to GitHub pages.
