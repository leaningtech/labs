---
title: Basic Server Setup
description: How do serve your own Java application with CheerpJ
---

## Overview

In order to run your Java applications in the browser you will need to host the application files.
This guide will go over some simple HTTP servers that can be used for basic testing and will talk about NGINX for a more advanced testing setup.

> [!note] Important
> Everything we will mention in this guide is for testing purposes on localhost, which is an exception to the usual cross-origin isolation requirements.
For production environments, it is important to use HTTPS to ensure cross-origin isolation and overall securitity, since cross-origin isolation cannot be achieved without HTTPS (with the exception of localhost). 

### What CheerpJ requires in a HTTP server

CheerpJ makes use [Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests), which means it downloads certain resources in chunks.
This means that the HTTP server that will used to server the Java application files requires support for the "Range" header.
Some servers might require some extra setup to enable this functionality, others support it by default and some might not work at all.

For example pythons `http-server` module, which is widely used for quick testing, does not support range headers and won't work with CheerpJ.

If your HTTP server does not support the "Range" header you will see an error message like this in the browser console:

> [!warning] Network error for http://127.0.0.1:8084/exampleApp.jar: HTTP server does not support the 'Range' header. CheerpJ cannot run.

NPM server packages like `npx serve` and `npx http-server` should support range requests by default and will work out of the box for simple testing.
They are simple to use NPM servers that don't require any setup.

The same counts for NGINX, which we go over in more detail later in the guide.

### Compressed JavaScript library files

With CheerpJ it is possible to use native libraries to implement Java native methods in JavaScript.
Native libraries in Java are typically loaded with the `System.loadLibrary` method allowing a Java program to call functions implemented in another language.
CheerpJ allows you to implement native libraries in JavaScript. You can find more information on how to implement that with CheerpJ in our [Native Libraries Guide](/docs/guides/implementing-native-librariest).

Some lot deployment setups use this to minimize network time. Often times both files, compressed and uncompressed library files will be present in the deployment folder:

```
└── sources
    ├── library.js
    └── library.js.gz
```

Like this when a network request for `library.js` file comes in, servers can respond with the compressed `library.js.gz` file to minimize network traffic.
`npx serve` supports this by default, and it can be enabled for `npx http-server` like this `npx http-server -g`.

Depending on your browser, you might run into problems with CheerpJ with such a server setup. In rare cases an error can happen since we get a `206` in our network response, indicading partial content, but also with a `Content-Encoding` header. This is forbidden since it's not clear if it's returning partial compressed data, or compressed partial data.

You will see a browser console error like this in this case:

> [!warning] `Network error for http://localhost:8085/jarExample/native.js: HTTP server returned compressed partial data. That should not happen. CheerpJ cannot run.`

If you see this error you need to disable compression for range requests, or just of compression in general. You can disable compression for `npx serve` like this `npx serve -u`, but that also means your server will only forward the original uncompressed .js files.

To properly forward the compressed files without the `Content-Encoding` header, you can for example use NGINX, which we will talk more about in the next section.

## NGINX Guide

We won't go into detail on how to install and setup NGINX, but rather talk about the configuration that is needed to make NGINX work seamlessly with CheerpJ.

To install and setup NGINX you can follow their official [Beginners Guide](https://nginx.org/en/docs/beginners_guide.html). Also keep in mind that the install process
might differ depening on your operating system. You can find more guidance on how to install NGINX on Windows [here](https://nginx.org/en/docs/windows.html) and for other operating systems [here](https://nginx.org/en/docs/install.html).

### Nginx Configuration File

### Get rid of 404 not found messages