---
title: "WebVM 2.0: A complete Linux Desktop Environment in the browser"
description: |
  [WebVM](https://webvm.io/alpine.html) is a full Linux environment running in the browser, client-side. It is a complete virtual machine, with support for persistent data storage, networking and, as of today’s release, Xorg and complete desktop environments.

  This article will explain the WebVM architecture, how the main components work, and what you can build with this technology.
authors:
  - alessandro
pubDate: "November 13 2024"
heroImage: "./hackathon-banner.png"
tags:
  - CheerpX
---

WebVM is a full Linux environment running in the browser, client-side. It is a complete virtual machine, with support for persistent data storage, networking and, as of today’s release, Xorg and complete desktop environments. In an instance of WebVM, everything executes locally within the browser sandbox.

WebVM runs on any modern browser, including mobile ones, thanks to WebAssembly, HTML5 and CheerpX: a novel x86 virtualization engine for browsers, developed by us at Leaning Technologies.

The first version of WebVM was released in 2022. Since then, we have been working relentlessly to improve the technology and it is with great pride that we are now releasing WebVM 2.0. This new release keeps pushing the boundaries of what can run on modern browsers, thanks to a vastly improved virtualization engine, support for Xorg, and a new UX design. Try out our [Alpine Linux / Xorg / i3 environment](https://webvm.io/alpine.html) now\!

<video controls autoplay loop muted playsinline>
	<source src="/blog/alpine-mines.mp4" type="video/mp4" />
</video>

[WebVM](https://github.com/leaningtech/webvm) 2.0 is a liberally licensed FOSS project for anyone in the community to use, modify and improve. This release marks another important milestone in our vision of running _any_ application in the browser, including those that can't be recompiled to WebAssembly.

## How does WebVM work?

![Overview of Architecture](./webvm_architecture_1.png)

WebVM is composed of four main building blocks: The CheerpX virtualization engine, a virtual storage backend, a networking layer, and the emulated graphical device.

CheerpX is a unique WebAssembly-based virtualization engine for x86 binary code. This engine is based on an efficient Just-In-Time compiler from x86 instructions into WebAssembly, plus an emulation layer for Linux system calls. This combination makes it possible to run unmodified Linux x86 binaries in the browser, and it is robust and scalable enough to run whole Linux distributions.

The second main component of WebVM is its streaming disk backend. One of the key benchmarks of success of WebVM is to be able to boot full, unmodified Linux distributions, _without requiring the preloading of the full file system_. This implies the ability to support 1GB+ root filesystems and to dynamically load disk blocks with low-latency, a critical concern for the overall performance of the VM.

Finally, the picture is completed by the private networking layer, implemented [via Tailscale](https://cheerpx.io/docs/guides/Networking) and Xorg support using the KMS Linux API. More on these in later sections.

## CheerpX: secure x86 virtualization in WebAssembly

![CheerpX Architecture](./webvm_architecture_engine.png)

CheerpX is an x86 virtualization engine in WebAssembly, designed to be robust, scalable, and performant. Since CheerpX is implemented exclusively using standard JavaScript / WebAssembly and Browser APIs, it is also extremely secure. CheerpX can be used like any other JavaScript library, either from our CDN or using the [NPM package](https://www.npmjs.com/package/@leaningtech/cheerpx).

Although the idea of running arbitrary binaries in the browser might sound worrying, CheerpX operates within the browser sandbox, and completely isolates the virtualized binary applications from your local environment. Access to files, networking and any other interaction between applications and the system are virtualized and implemented using standard Web APIs.

CheerpX runs unmodified x86 binaries, without any preprocessing or requiring custom compilation options. This means CheerpX can not only run open source applications and libraries, which might be recompiled, but also legacy or proprietary code. Beside powering WebVM, CheerpX is the core component of [CheerpX for Flash](https://leaningtech.com/cheerpx-for-flash/), which has been successfully used to run legacy Flash applications using the unmodified binary plugin from Adobe. We have also recently released [CheerpX Games Runner](https://chromewebstore.google.com/detail/cheerpx-games-runner-beta/kpjhccfibjgklihcmaddjecaenppaahg): a Chrome extension, currently in beta, that makes it possible to run games purchased from [GOG](https://www.gog.com/en/), directly in the browser.

CheerpX has been in development since 2017, and was first announced in 2020. Its public APIs have been recently finalized in preparation for the upcoming release of CheerpX 1.0! You can learn more about CheerpX [here](https://cheerpx.io/docs). CheerpX is completely free-to-use for individuals, for any kind of project. For more information see our [Licensing](https://cheerpx.io/docs/licensing) page.

## Low-latency disk backend with private and local storage

![Streaming Disk Backend Architecture](./webvm_architecture_disk.png)

One of the primary ambitions of WebVM is to be scalable enough to support large, unmodified Linux distributions with good performance on arbitrary workflows. Working with large disk images was one of the main challenges we faced in the development of WebVM. The most common solution when trying to solve similar problems, is to prefetch the subset of the disk known to be useful for the specific demo, ahead of time. However, since the purpose of WebVM is to give complete control to the user, we cannot predict which, of the many available applications, REPLs or compilers will be started. In this scenario the whole model of pre-fetching breaks down.

After several iterations, we settled on a solution that achieves our goals at scale. WebVM implements a streaming disk device that downloads 128kb disk blocks on-demand from a Cloudflare Worker backend, using WebSockets. The worker is executed in the nearest datacenter from the globally distributed CloudFlare CDN, ensuring the lowest possible latency. Using WebSockets further helps in maintaining a stable latency from challenging networking environments. This solution has proved to be performant, scalable and very cheap, providing per-block latencies measured to be around 20-40ms.

Read-Write support with local persistence is achieved using standard Web APIs. Disk blocks streamed from the backend are saved locally to IndexedDB. Any further modification is also stored to the same IndexedDB layer. This provides both persistence for modified data and a local caching layer for even faster repeated access to WebVM.

CheerpX also supports a plain HTTP disk backend that uses byte ranges to download blocks on demand. This is recommended when building your own version of WebVM or any other CheerpX-based project. See [here](https://cheerpx.io/docs/tutorials/full_os) for more information.

## Private networking via your own VPN

![Networking Architecture](./webvm_architecture_network.png)

Adding support for general networking was another thorny problem in developing WebVM. Modern browsers do not provide access to low-level TCP/UDP sockets, which are the fundamental building block for most other networking protocols. This means that some form of network virtualization is required.

Over time, we realized that the actual technical complexities in doing so are compounded with a lot of confusion around browser-based networking, resulting in some very frequently asked questions:

- **Can’t you just use WebSockets?** WebSockets are _not_ low-level sockets, but just an extension to the high-level HTTP protocol. A useful extension, of course, but not a replacement for TCP sockets.
- **Can you support HTTPS traffic originating from the VM by using fetch?** This is also not possible. The traffic CheerpX receives is _already_ encrypted by the application or SSL library by the time it reaches the syscalls. While we _could_ install our own root CA certificate and effectively man-in-the-middle every connection, this strategy seems like a profound breach of user trust, and we strongly decided against it. Moreover, it would not have helped much, see the next question.
- **Ok, no HTTPS, but what about plain HTTP?** In this case it could be possible to reconstruct a valid HTTP request from low-level socket traffic, but it would be of little use. The browser only allows HTTP traffic to the same origin, or to origins that are configured to allow cross-origin traffic using CORS headers. Very few websites use these headers, which means that this solution will not actually work in the vast majority of cases.

The “easy” solution to this problem is to maintain a WebSocket-based proxy that relays all user traffic to the internet. This is a very poor solution for the following reasons:

- **Scale and cost:** With the level of use we see daily with WebVM, this would not be just a matter of spinning up a VPS, but would require a distributed and scalable solution. Moreover, we would need to bear the cost of all the bandwidth of WebVM users globally.
- **Privacy:** We care a lot about the privacy of our users. We have designed our disk backends to be fully private and local, and we would certainly not be comfortable in siphoning all their internet traffic to our servers.
- **Abuse:** Finally, if we had an open relay to the internet, we could also be considered responsible for any nefarious or malicious activity of our users.

To solve this last problem in particular, we would need to force users to register accounts and keep track of their traffic as required by regulations. We would need, effectively, to build a VPN provider. Since we are not in the business of making VPNs, we decided to delegate this responsibility to an established solution instead.

After a long research we found that integrating with [Tailscale](https://tailscale.com/) is the best solution to provide internet connectivity to WebVM and any other project based on CheerpX.

Tailscale is designed to build private VPNs across your devices anywhere on the internet. A key feature of Tailscale from our perspective is their [DERP servers](https://tailscale.com/kb/1232/derp-servers), that supports connecting devices from really constrained networking environments using WebSockets. As it happens, the browser is exactly one of those heavily constrained environments.

WebVM is directly integrated with Tailscale, and it’s possible to connect to your network in just a few clicks. Creating an account is trivial, since Tailscale supports logging-in with the major OAuth providers. To access the wider internet the user also needs to set up an “Exit Node”, to relay traffic beyond the Tailscale network. The whole process is documented [here](https://tailscale.com/kb/1103/exit-nodes).

This latter step, although not difficult, introduces more friction that we would like. We are hopeful that future integration between Tailscale and VPN providers such as [Mullvad](https://tailscale.com/mullvad) will make it possible to use ready-made exit nodes.

A very interesting use case that does not require an exit node is WebVM-to-WebVM traffic. For example, a security Capture-The-Flag competition could be hosted completely inside WebVMs, with traffic never requiring access to the wider internet.

Finally, using Tailscale also makes it possible for us to support the self-deployment scenarios and private networks common in the enterprise sector. A self-hostable open source implementation of the Tailscale protocol, called [Headscale](https://github.com/leaningtech/headscale), can be used in such cases to completely remove the need for third party networking infrastructure.

## The Linux KMS API and Xorg support

![Graphics Architecture](./webvm_architecture_display.png)

The last big improvement to WebVM for this release has been support for graphical applications, including booting a complete desktop environment. For now we have settled on using _i3_, a minimalistic window manager, to make sure the demo is enjoyable by most users, even on mobile devices, without consuming excessive amounts of data. Further improvements in our roadmap will make it practical to run the much heavier XFCE environment in future releases.

The desktop environment runs on top of the traditional Xorg server which, like any other application, runs completely unmodified with CheerpX. This works by implementing the `/dev/dri/card0` device and the _KMS_ kernel API. _KMS_ stands for Kernel Modesetting and it provides standardized and uniform access to GPU framebuffers. Thanks to _KMS_ it's possible, for example, for a Linux system to move from the early kernel messages, the boot animation and Xorg without flickering, since access to the GPU is coordinated across all these steps.

_KMS_ is a somewhat convoluted and not always well documented API, but with some effort we managed to support it in CheerpX, allowing Xorg to run with the standard drivers provided by any distro. For now we only support the subset of the API required for 2D rendering, but we have plans to support 3D as well, most likely via WebGPU.

If you are wondering about Wayland support, it is in our roadmap but will take some more time. First of all Wayland depends on EGL, which is not yet supported. Moreover, although support is expanding, not every application can currently work on top of Wayland. WINE, for example, has for the longest time only supported Xorg, with an official Wayland driver being introduced only recently.

## Why?

WebVM is, for us, both a demonstration of the capabilities of CheerpX and a self-standing useful tool. The default terminal-based WebVM interface, available at [https://webvm.io](https://webvm.io), is the perfect solution to access command line tools while on-the-go. Running code snippets, using ssh or pushing a quick commit to a git repo are all great use cases.

WebVM could also be extremely useful for schools and universities, by providing zero-maintenance and zero-cost access to development environments without the friction of traditional local installations.

On the other hand the new [Alpine i3 environment](https://webvm.io/alpine.html) proves how effective CheerpX is at running graphical applications. By customizing this setup it will be possible to access existing graphical applications securely using modern browsers. This is especially interesting for legacy Windows applications, developed with technology such as MFC, VB6, Delphi, or similar outdated toolkits that are often used for internal applications in large enterprises. Legacy games are also a great target and will be the focus of our next project. Stay tuned.

## What’s next?

Releasing WebVM 2.0 and the CheerpX 1.0 stable API represents a big milestone for us, but it’s far from being the end of the road.

CheerpX will continue to evolve and improve performance across all the various components discussed above. These efforts will close the gap required to run even more complex graphical environments, such as the aforementioned XFCE.

Furthermore we plan to improve CheerpX to support running Docker containers, making it possible to build a new generation of development environments that runs client side.

WebVM will also evolve in parallel, building on top of the improved UX to make it even more powerful and easier to use. We are looking forward to discovering what our users will build with this technology. At its core WebVM is a free, always available, private Linux VM. The possibilities are, quite literally, endless.

## Conclusions

We hope you find the new WebVM, and the CheerpX engine, as exciting as we do. If you find a bug, please open an issue on [GitHub](https://github.com/leaningtech/webvm/issues). WebVM is FOSS, you are welcome to fork and modify it as you see fit. WebVM even includes ready-made GitHub actions to deploy your custom WebVM to GitHub Pages with just a few clicks. PRs from the community are also welcome.

The release of CheerpX 1.0 is coming up shortly, featuring a license model that allows any individual to use it for free for any purpose, including open source and commercial projects. Commercial licensing is available for organizations interested in building applications with CheerpX. Our [Licensing page](https://cheerpx.io/docs/licensing) covers all the details.

For any question, you can find Leaning Technologies engineers, including myself, on our [Discord](https://discord.leaningtech.com). We are building a lively community, which recently passed the one thousand users mark. We are also happy to provide guidance and support for any bug you might find in either WebVM or CheerpX.

You can also find us at the following links. See you soon, and enjoy our tech.

[X.com / Alessandro Pignotti](https://x.com/alexpignotti)

[X.com / Leaning Technologies](https://x.com/leaningtech)

[Leaning Technologies Labs](https://labs.leaningtech.com/)

[LinkedIn](https://www.linkedin.com/company/2739659/)

[Email](mailto:info@leaningtech.com)
