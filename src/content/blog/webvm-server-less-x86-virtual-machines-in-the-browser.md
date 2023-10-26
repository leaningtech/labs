---
title: "WebVM: server-less x86 virtual machines in the browser"
description: |
  We made a server-less virtual Linux environment that runs unmodified Debian binaries in the browser. This is powered by CheerpX, a WebAssembly virtualization platform. Feel free to play with it and report bugs: https://webvm.io
pubDate: "2022-02-01"
categories:
  - "technical-blog"
  - "webvm"
authors:
  - alessandro
heroImage: ./webvm-post.png
---

> TL;DR — We made a server-less virtual Linux environment that runs unmodified Debian binaries in the browser. This is powered by CheerpX, a WebAssembly virtualization platform. Feel free to play with it and report bugs: [https://webvm.io](https://webvm.io/)

![](./images/1*en0eK_11xULHPZftaG7aPQ.png)

WebVM — a server-less virtual Linux environment running fully client-side in HTML5/WebAssembly.

The web platform is well on its way to becoming the dominant platform for application distribution. While clear for a long time, this trend has accelerated since the standardization of [WebAssembly](https://webassembly.org/): a new programming language, supported by all modern browsers and designed to fulfil the performance needs of large-scale Web applications.

WebAssembly brings real innovation to the world of browsers, together with a shift in perspective and responsibilities.

Engines are traditionally expected to squeeze performance from (potentially poorly) human-written JavaScript. WebAssembly, on the other hand, is designed as a compilation target. Achieving a high level of runtime performance is mainly the responsibility of the *compiler generating it*. When running WebAssembly, engines can avoid expensive checks and quickly generate high-quality native code. Ultimately, this enables the delivery of much more complex applications via the Web.

While the vast majority of WebAssembly-generating toolchains are native and used ahead of time, this is not a requirement*.* As a matter of fact, we believe that **JIT-compiled WebAssembly is the real key to fulfilling the vision of running any application in the browser**.

Here at Leaning Technologies, our mission is to enable running *existing* applications:

- without modifications;
- without recompilation;
- fully client-side.

A few months ago we released the [REPL demo](https://repl.leaningtech.com/), proving that our CheerpX x86-to-WebAssembly virtualization technology could be used to run multiple different REPLs in the browser without any language-specific intervention.

Today we are proud to announce a major step towards realizing our vision: [WebVM](https://webvm.io/), a full Debian based virtual machine running in the browser, powered by CheerpX.

# So, what is CheerpX?

[CheerpX](https://leaningtech.com/cheerpx/) is a x86 virtual machine, written in C++ and compiled to a combination of JavaScript and WebAssembly with the [Cheerp](https://leaningtech.com/cheerp/) compiler.

CheerpX has been in development for over three years, and it is already used in production as part of [CheerpX for Flash](https://leaningtech.com/cheerpx-for-flash/), an Enterprise solution to run legacy Adobe Flash content.

At a high level, CheerpX is composed of

- **An efficient interpreter for x86** used to run rarely executed code and to discover the structure of hot code for the purpose of guiding JIT compilation
- **A sophisticated x86-to-Wasm JIT compiler**, that generates new WebAssembly modules on the fly from hot x86 code. Although the JIT compiler has some x86 specialized logic, it is mostly target independent.
- **A Linux syscalls emulation layer** is used to bridge the gap between the unmodified x86 binaries and the Web environment.
- **A block-based filesystem backend**, based on Ext2. Disk images are static resources distributed via HTTP and the CloudFlare CDN. Ext2 was chosen for its proven design and extensibility, and we can easily extend its features over time to be compatible with the more modern Ext3 and Ext4 formats without a full rewrite.
- **Privacy-preserving storage for modified blocks**, based on IndexedDB. This client-side-only technology allows any modification made to the filesystem to be persistent, but only to the browser. We don’t see or store any of your data.

CheerpX is a very complex system with many moving parts. It correctly deals with tricky situations such as self-modifying code, multithreading, multiprocessing, and inter-process communication. Notwithstanding this complexity, CheerpX has already reached a high level of stability.

Now it feels like the perfect time to release our most-complex demo, yet: WebVM.

# So, what is WebVM?

If you have seen our previous REPL demo, you might notice that WebVM is not conceptually much different. The same core components are used:

- **CheerpX** as the execution engine. JavaScript APIs, in particular cx.run(…), are used to start (and restart if required) a *bash* process. bash can then start other processes as the user types commands.
- **Xterm.js** as the main UI component. Xterm.js takes care of interpreting terminal escapes used by applications such as *vim,* and also sends back user input into CheerpX. Input is made available to the applications via their standard input file descriptor.
- **A Debian buster disk image**, in the ext2 format and with a bunch of packages installed. This is distributed over a CDN to maximize scalability.

WebVM is effectively server-less and has no *active* server-side component. All users access the same disk image from the CDN, with their individual changes being preserved locally to the browser. This means that we could support even millions of concurrent users with minimal costs and resources.

Our previous demos were intended as snapshots of CheerpX progress and showcases of the technology potential. WebVM is different in that we consider this to be a *living demo* that we will evolve over time*.* Bug reports and feedback are very welcome, over multiple channels:

**GitHub issues**: [https://github.com/leaningtech/webvm/issues](https://github.com/leaningtech/webvm/issues)

**Gitter chat**: [https://gitter.im/leaningtech/cheerpx](https://gitter.im/leaningtech/cheerpx)

CheerpX has been, so far, only exposed to users in a relatively controlled fashion. One single application at a time. WebVM is the first time we really give control to a wider public and we do expect problems to arise. But public feedback will make it possible to discover many more bugs and, ultimately, deliver a more robust solution.

# What can I do with WebVM right now?

We think the [demo](https://webvm.io/) will, most likely, speak for itself. If case you are unsure, try this:

\# Run a short python program
**python3 examples/python3/fibonacci.py**\# Compile a small C example using gcc
**gcc -o helloworld examples/c/helloworld.c**\# Run it!
**./helloworld**\# Dump the code, to verify this is actually an x86 binary
**objdump -d ./helloworld**\# Edit the helloworld.c file, and try again
**vim examples/c/helloworld.c**

Example files for various languages are available in the `examples` directory. If, for any reason, you don’t like to use `gcc`, feel free to try `clang` as well!

# Where can I run it

WebVM and CheerpX are compatible with any browser, both on Desktop (Chrome/Chromium, Edge, Firefox, Safari), and Mobile (Chrome, Safari), provided support for [SAB](https://caniuse.com/?search=SharedArrayBuffer) is present, and the device has sufficient memory.

# Is this all?

This release of WebVM is really just a first step. We plan to improve and evolve WebVM over time, and feedback from users will be guiding our efforts.

In the short term, this is what the pipeline for the next features of WebVM and CheerpX looks like:

- **HTTP servers (microservices)**: By combining Service Workers with virtualized TCP sockets, we will allow HTTP servers inside the WebVM to be reachable from the browser itself. A JavaScript API will be exposed allowing to connect an `iframe` to the internal servers. This is mostly supported already, although not exposed on the current demo page. A similar solution could be used to support **REST microservices** as well since Service Workers also handle fetch/XHR requests.
- **Graphical Linux applications**: CheerpX will soon allow Xorg applications to run in WebVM. Xorg communicates with X clients over **UNIX sockets**, which are already supported. To actually display graphics we will need to emulate a Linux device that Xorg can talk to. The best solution seems to be using KMS devices. Getting to a basic level of support for graphical output to work is mostly a matter of allocating a framebuffer that Xorg can use, and blit that over to an HTML5 `canvas` for display.
- **Windows applications and games**: Using **WINE**, which is a binary-compatible re-implementation of the Windows API libraries. Similarly to Xorg WINE uses UNIX sockets to coordinate applications with the `wineserver`, which is broadly equivalent to the Windows kernel. In terms of CheerpX support, there might be some fine-tuning needed for our `mmap` implementation, since WINE needs careful control over a process’ address space. Some specialized features of UNIX sockets, for example, passing of file descriptors, might also need some work. Still, all of these would be small improvements to the existing infrastructure.

We hope you’ll find WebVM as exciting as we do.

Do you think that you have the *perfect* use case for our technology? Feel free to get in touch:

**Email**: [info@leaningtech.com](mailto:info@leaningtech.com) | [alessandro@leaningtech.com](mailto:alessandro@leaningtech.com)

**Twitter**: [https://twitter.com/leaningtech](https://twitter.com/leaningtech) | [https://twitter.com/alexpignotti](https://twitter.com/alexpignotti)

**Chat support**: [https://github.com/leaningtech/cheerpx](https://github.com/leaningtech/cheerpx)

**Web**: [https://leaningtech.com/cheerpx](https://leaningtech.com/cheerpx)
