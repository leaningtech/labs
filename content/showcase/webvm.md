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

WebVM is a server-less virtual Linux environment running fully client-side in HTML5/WebAssembly. The core components are:

- **CheerpX** as the execution engine. JavaScript APIs, in particular `cx.run(…)`, are used to start (and restart if required) a *bash* process. bash can then start other processes as the user types commands.
- **Xterm.js** as the main UI component. Xterm.js takes care of interpreting terminal escapes used by applications such as *vim,* and also sends back user input into CheerpX. Input is made available to the applications via their standard input file descriptor.
- **A Debian buster disk image**, in the ext2 format and with a bunch of packages installed. This is distributed over a CDN to maximize scalability.

WebVM is effectively server-less and has no *active* server-side component. All users access the same disk image from the CDN, with their individual changes being preserved locally to the browser. This means that we could support even millions of concurrent users with minimal costs and resources.
