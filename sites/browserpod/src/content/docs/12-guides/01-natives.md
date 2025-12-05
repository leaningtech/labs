---
title: Native binaries
description: Using packages with native binary components
---

## Overview

BrowserPod can run any JavaScript code that runs in Node.js. But there are NPM
packages that ship native binary components for specific architectures.
These are usually build-time tools like compilers and bundlers.

These native binaries cannot run in BrowserPod, but they often have alternatives
that are compiled to WebAssembly and are thus truly cross-platform.

In order to use these alternatives, you need to specify them as overrides in your
package.json file.

In this page you can find a list of well-known packages with native binary dependencies
and their corresponding WebAssembly overrides.

## esbuild

This is a very commonly used bundler. It can be used directly but it's also a
dependency of the _vite_ build tool.

To replace it with the WebAssembly version, add this to your package.json:

```json
{
  ...,
  "overrides": {
    "esbuild": "npm:esbuild-wasm@*",
  },
  ...
}
```

## rollup

This is a very commonly used bundler. It can be used directly but it's also a
dependency of the _vite_ build tool.

To replace it with the WebAssembly version, add this to your package.json:

```json
{
  ...,
  "overrides": {
    "rollup": "npm:@rollup/wasm-node@*"
  },
  ...
}
```
