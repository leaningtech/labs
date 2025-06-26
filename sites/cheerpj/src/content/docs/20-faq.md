---
title: Frequently Asked Questions
---

## What is CheerpJ?

CheerpJ is a solution for running unmodified Java client applications into browser-based HTML5/JavaScript web applications. CheerpJ consists of a full Java runtime environment in JavaScript, and of a on-the-fly compiler for dynamic class generation, to be deployed alongside the application.

## What parts of the Java SE runtime are supported?

The CheerpJ runtime environment is a full Java SE runtime in JavaScript. Differently from other technologies which provide a partial re-implementation written manually in JavaScript, we opted to replace the entire OpenJDK Java SE runtime to JavaScript and WebAssembly. The CheerpJ runtime is constituted of both JavaScript files and .jar archives. All CheerpJ runtime components are dynamically downloaded on demand by the application to minimise total download size. The CheerpJ runtime library is hosted by us on a dedicated CDN-backed domain, and we invite users to link to it in order to take advantage of caching and cross-application resource sharing.

## Which Java versions are supported?

The new architecture introduced in CheerpJ 3.0 is engineered to fix the gap with modern Java versions quite easily. Currently, CheerpJ 4.2 supports Java 8, 11 and 17, ([learn more here](/docs/reference/cheerpjInit#version)), with plans on supporting newer versions in the near future.

## Can I self-host the CheerpJ runtime?

Please [contact us](https://cheerpj.com/contact/) to discuss self-hosting CheerpJ and its runtime on your infrastructure.

## Can I use CheerpJ to run my legacy Java application in the browser? I have no longer access to the source code.

Yes, you can run any Java SE application with CheerpJ without touching the source code. You only need all the .jar archives of your application.

## Can I use Java libraries and integrate them in my HTML5 application using CheerpJ?

Yes. Java methods can be exposed to JavaScript with an interface compatible with async/await for convenience.

## Can I call JavaScript libraries or web APIs from Java?

Yes, CheerpJ allows you to interoperate with any JavaScript or browser API. Java native methods implemented in JavaScript are supported.

## Does CheerpJ support reflection?

Yes.

## Does CheerpJ support dynamic class generation?

Yes.

## When I run CheerpJ I see 404/403 errors in the browser console. What's going on?

Ignore those errors. CheerpJ provides a filesystem implementation on top of HTTP. In this context it is absolutely ok for some files to be missing. CheerpJ will correctly interpret 404 errors as a file not found condition.

## My application compiled with CheerpJ does not work and I just see the "CheerpJ runtime ready" on the top of the screen. What's going on?

Many first time users get stuck at this point. The most common issues are:

- Opening the HTML page directly from disk: The URL in the browser should always start with http:// or https://, if it starts with file:// CheerpJ will not work. You need to use a local web server during testing.
- Forgetting to add "/app/" prefix to the JAR files used in Web page. CheerpJ implements a virtual filesystem with multiple mount points, the "/app/" prefix is required.
- More in general, you can use the "Network tab" of the developer tools in the browser to check if the JAR is being correctly downloaded. If the JAR is never downloaded, or a 404 error is returned, something is wrong with the JAR path. If you don't see anything in the "Network tab", please reload the page while keeping the developer tools open.

## Can I play Old School RuneScape using CheerpJ or the CheerpJ Applet Runner extension?

Not yet. The main problem is that RuneScape requires low level network connections primitives (sockets) which are not provided by browsers at this time due to security concerns. In the future we might provide a paid add-on to the CheerpJ Applet Runner extension to support this use case via tunneling.

## Do I need to install anything to use CheerpJ?

No, there is nothing to download or install on your computer. CheerpJ runs entirely within the browser, so you don’t need an executable file (e.g., `.exe`).

## What is the status of CheerpJ?

CheerpJ is actively developed by [Leaning Technologies Ltd](https://leaningtech.com), a British-Dutch company focused on compile-to-JavaScript and compile-to-WebAssembly solutions.
