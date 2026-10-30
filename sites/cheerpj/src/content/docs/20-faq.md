---
title: Frequently Asked Questions
---

## What is CheerpJ?

CheerpJ is a Java Virtual Machine and a full build of OpenJDK for the browser, implemented in WebAssembly and JavaScript. It runs Java applications, applets, Java Web Start applications and libraries in Chrome, Edge, Firefox and Safari, from their compiled JARs, with no plug-in, no Java installation and no server-side JVM.

## What parts of the Java SE runtime are supported?

All of it. CheerpJ runs the OpenJDK class library itself, not a reimplementation, and OpenJDK's own native code is compiled to WebAssembly. This includes Swing and AWT, reflection, custom class loaders, networking, files, the clipboard, printing and audio.

The runtime is a set of static files: JavaScript, WebAssembly and JARs. CheerpJ downloads only the parts an application uses, as it needs them, and the browser caches them for the next visit. You can load the runtime from the CheerpJ CDN, or [self-host it](/docs/licensing#self-hosting). The [compatibility page](https://cheerpj.com/compatibility/) lists what is supported in detail.

## Which Java versions are supported?

CheerpJ 5.0 supports Java 8, 11, 17 and 21, with Java 25 in preview. Java 8 is the default; choose another version with the [`version`](/docs/reference/cheerpjInit#version) option of `cheerpjInit`. Applets, and the CheerpJ browser extensions, run on Java 8 only.

## Can I self-host the CheerpJ runtime?

Yes. Self-hosting is allowed during technical evaluation, is available as an add-on with Small Business licences, and is included with Enterprise licences. See [licensing](/docs/licensing#self-hosting), and [contact us](https://cheerpj.com/contact/) to discuss your deployment.

## Can I use CheerpJ to run my legacy Java application in the browser? I have no longer access to the source code.

Yes. CheerpJ runs compiled bytecode as it is, so you need only the application's JAR files, not its source code. Obfuscated and encrypted bytecode works too. See [running a Java application](/docs/getting-started/Java-app).

## Can I use Java libraries and integrate them in my HTML5 application using CheerpJ?

Yes. In [library mode](/docs/guides/library-mode), JavaScript and TypeScript code loads Java classes, creates objects and calls their methods with `async` and `await`. See [running a Java library](/docs/getting-started/Java-library).

## Can I call JavaScript libraries or web APIs from Java?

Yes. Java native methods can be [implemented in JavaScript](/docs/guides/implementing-native-methods), so Java code can call any JavaScript library or browser API.

## Does CheerpJ support reflection?

Yes.

## Does CheerpJ support dynamic class generation?

Yes. Classes generated at runtime, proxy classes and classes loaded by custom class loaders all work.

## When I run CheerpJ I see 404/403 errors in the browser console. What's going on?

You can ignore them. CheerpJ's `/app/` file system reads files from your web server over HTTP, and Java looks up many files that do not exist, such as optional resources and classes on the class path. CheerpJ treats a 404 as "file not found", as Java expects.

## My application compiled with CheerpJ does not work and I just see the "CheerpJ runtime ready" on the top of the screen. What's going on?

CheerpJ started, but the application did not. The most common causes are:

- **Opening the page from disk.** The URL must start with `http://` or `https://`. With `file://`, CheerpJ does not work. Use a local web server during testing: see [server setup](/docs/guides/basic-server-setup).
- **Forgetting the `/app/` prefix.** CheerpJ has a virtual file system with several mount points, and files on your web server are under `/app/`. A JAR at `http://localhost:8080/my_application.jar` is `/app/my_application.jar`.
- **A wrong JAR path.** Open the Network tab of the browser's developer tools and check that the JAR is downloaded. If it is never requested, or returns a 404, the path is wrong. If the tab is empty, reload the page with the developer tools open.

The browser console usually shows the Java exception. See [debugging CheerpJ](/docs/guides/cheerpj-debug) for more.

## Can I play Old School RuneScape using CheerpJ or the CheerpJ Applet Runner extension?

No. RuneScape connects to its game servers with raw TCP sockets, which browsers do not give web pages. CheerpJ provides sockets only through a [Tailscale network](/docs/guides/Networking), and the game servers are not on one.

## Do I need to install anything to use CheerpJ?

No. CheerpJ runs entirely in the browser, so there is nothing to download or install, and no Java installation is needed. Developers add CheerpJ to a page with one script tag. Users who run existing applets or Java Web Start applications can install a [CheerpJ browser extension](https://cheerpj.com/extensions/).

## What is the status of CheerpJ?

CheerpJ is actively developed and commercially supported by [Leaning Technologies](https://leaningtech.com), a British-Dutch company focused on compile-to-JavaScript and compile-to-WebAssembly technologies. It has been in production since 2017. See the [changelog](/docs/changelog) for recent releases.
