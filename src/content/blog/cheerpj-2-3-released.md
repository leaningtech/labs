---
title: "CheerpJ 2.3 Released"
description: |
  CheerpJ 2.3 is the only solution on the market to migrate real-world large-scale Java applications to modern HTML5 with pixel-perfect accuracy.
pubDate: "2022-05-03"
categories:
  - "cheerpj"
  - "technical-blog"
authors:
  - "lorenzo-marsicano"
heroImage: ./cheerpj.png
---

CheerpJ is a solution to run unmodified Java applications on the browser, in WebAssembly and JavaScript.

It is based on two components: a full Java runtime environment in WebAssembly and JavaScript, and an ahead-of-time Java bytecode to JavaScript compiler. By combining these two elements, CheerpJ provides an environment to run any type of Java application (stand-alone, Java Applet, Java libraries) as a pure HTML5 Web application.

CheerpJ, originally released around 5 years ago, is trusted by [many large organizations](https://leaningtech.com/cheerpj/) to:

1. Preserve access to critical internal Java clients (Java applets and stand-alone applications) without relying on legacy browsers, and without a client-side Java installation;
2. Convert existing Java products into HTML5, and provide them to external users as a browser-based experience;
3. Integrate complex Java components as part of web applications, or develop new web-based interfaces to Java-based products.

CheerpJ 2.3 is the only solution on the market to migrate real-world large-scale Java applications to modern HTML5 with pixel-perfect accuracy.

# CheerpJ at a glance

CheerpJ can be used to run Java bytecode on the browser as WebAssembly/JavaScript.

It is intended to work as a pure-HTML5 replacement to the JVM, and allow any type of unmodified Java client to run on the browser.

Being compatible with 100% of the Java 8 language (including reflection and all dynamic features), as well as with the full Java 8 runtime, it can run any application including Swing clients, AWT clients, and any complex frameworks, including Oracle Forms.

Thanks to Java-JavaScript bidirectional interoperability, CheerpJ can also be used to integrate Java libraries as part of web applications or to rewrite UIs to legacy Java clients.

CheerpJ provides several browser-based system functions, including virtualized file systems, I/O, networking and audio.

Since release 2.2 (release notes [here](https://leaningtech.com/cheerpj-2-2-released/)), there have been improvements in how files are read and written in our custom file system, class generation now allows for non-ASCII fields to be present and improvements in how network connections are handled have been made. The full Changelog for version 2.3 of CheerpJ is available [here](https://docs.leaningtech.com/cheerpj/Changelog).

# Getting started

CheerpJ 2.3 is [available](https://leaningtech.com/cheerpj/#download) for Windows, macOS and Linux. You can download it, integrate it and test it with no restrictions.

You can head to our [Documentation](https://docs.leaningtech.com/cheerpj/) for examples and tutorials.

# How to upgrade to CheerpJ 2.3

To try out or update to CheerpJ 2.3, simply download the compiler [here](https://leaningtech.com/download-cheerpj/) , and rebuild your project with the new compiler.

If using the CheerpJ cloud runtime, make sure to change your CheerpJ runtime header to

<script src=”[https://cjrtnc.leaningtech.com/2.3/loader.js](https://cjrtnc.leaningtech.com/2.3/loader.js)“></script>

The old 2.2 version will keep working, but the only way to gain the benefits of this new release is to change the runtime endpoint and regenerate the jar.js files.

Please notice that using the new runtime with a jar.js generated with the 2.2 compiler is unsupported and might lead to unexpected behaviours.

# Download and try CheerpJ

If you have never tried our compiler before it’s really easy!

Just only have to use our compiler that you can find here and update your HTML page hosting the applet or create a simple HTML for it.

You can follow [this link](https://docs.leaningtech.com/cheerpj/) to our wiki and follow the [Getting Started](https://docs.leaningtech.com/cheerpj/Getting-Started) for detailed instructions.

You can also try CheerpJ online using our [Java Fiddle](https://javafiddle.leaningtech.com/).

# Future releases

We have exciting news for the next release, more of which will be shared in the coming months!

For CheerpJ 3.0 we are planning a complete redesign of the compiler based on the lessons we learned from working on [CheerpX](https://medium.com/leaningtech/running-flash-in-webassembly-using-cheerpx-an-update-d500b6fbc44e) and [WebVM](https://medium.com/leaningtech/webvm-client-side-x86-virtual-machines-in-the-browser-40a60170b361).

The new architecture, that we are currently designing, will bring improvements to startup time, download size and compatibility with sophisticated Java frameworks.

CheerpJ 3.0 will, one more time, redefine what running Java in the browser means.
