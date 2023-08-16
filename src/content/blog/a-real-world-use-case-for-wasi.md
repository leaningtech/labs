---
title: "Unexpectedly Useful: A Real World Use Case For WebAssembly System Interface (WASI)"
description: |
  At Leaning Technologies we are heavily invested in WebAssembly, and we are actively contributing to push the standard forward. Just a few months ago WebAssembly tail-calls were standardized, and we are currently bringing the branch-hinting proposal to Phase 4.
authors:
  - yuri
  - alessandro
pubDate: "April 6 2023"
heroImage: "https://leaningtech.com/wp-content/uploads/2023/04/WASI-article-main.png.webp"
tags:
  - CheerpJ
---

At Leaning Technologies we are heavily invested in WebAssembly, and we are actively contributing to push the standard forward. Just a few months ago WebAssembly tail-calls  were [standardised](https://github.com/WebAssembly/tail-call/issues/15#issuecomment-1357278111) thanks to our [work](https://leaningtech.com/fantastic-tail-calls-and-how-to-implement-them/), and we are currently bringing the [branch-hinting](https://github.com/WebAssembly/branch-hinting) proposal to Phase 4 (with progress currently hindered by a tangential [issue](https://github.com/WebAssembly/annotations/pull/17/files) connected to the reference interpreter implementation).

All of our efforts have a strong focus on the browser/Web platform. As a matter of fact, for quite some time, we have been skeptical about non-browser and server-side use cases for Wasm.

Over the last few weeks our position has partially changed though, since we have identified a perfect scenario for WASI that brought us to implement preliminary support for the proposal in our tools.

## A matter of consistency

As it is often the case for technical blog posts, this story begins with an internationalization issue. One of our most popular tools is [CheerpJ](https://leaningtech.com/cheerpj/), a compiler and runtime designed to run large, unmodified, Java applications fully client-side in the browser. CheerpJ is a stable, mature product and it is used in production by thousands of users. This said, we have never been completely satisfied with the level of support for multiple font files, which are especially critical for users of non-latin scripts.

We are currently working on CheerpJ 3.0: a full revamp of our technology that will be released in summer 2023. As part of this work, we want to structurally remove as many pain points for our users as possible, including international fonts support. To do so, we have integrated support for the _fontconfig_ library as part of the WebAssembly build of the OpenJDK native code.

_Fontconfig_ is the de-facto standard solution for font configuration and management on Linux systems. It works by building a pre-processed database of all installed fonts using a custom binary format. Applications can then query the database to lookup the most appropriate font files, and directly use just them. To build the database, _fontconfig_ needs to access all the installed fonts, but that is not a problem since it’s done only once.

In the case of CheerpJ fonts files are retrieved on demand via HTTP, downloading all of them for the sake of building the database would be severely detrimental to the user experience. The solution for this problem is to generate the _fontconfig_ database at build time (using the native `fc-cache` command on the host) and deploy the pre-built database plus all the font files to our CDN. Java applications converted using CheerpJ would then download the database to select which specific font files to access via HTTP.

This plan turned out to be a proverbial can of worms.

- As much as _fontconfig_ is used by every single Linux system, it still seems to be barely maintained. The library is _supposed_ to support a sysroot parameter to configure a system starting from a directory. This works partially, with the level of support changing each version and not necessarily in the direction of _progress_.
- The database format (and even the file name) is architecture dependent and, in practice, inconsistent between the x86 hosts building CheerpJ and the WebAssembly version of _fontconfig_ used at runtime
- Even working around these inconsistencies, the database would fail to load due to nanosecond-precision file timestamps being not available in the browser environment.

After a few days of fighting these issues, we realized that the only principled solution to such inconsistencies was to use the exact same _fontconfig_ version both at run-time and build-time.

At first we considered using the advanced [JavaScript interoperability](/cheerp/reference/javascript-interop) of _Cheerp_, our C++ to WebAssembly/JavaScript compiler, to directly use nodejs to run the `fc-cache` Wasm build on the host, but then we realized that a more appropriate solution had already been designed: the WASI standard proposal.

## What is WASI?

WASI, short for WebAssembly System Interface, is an API specification that defines a standard interface between WebAssembly modules and their host environments.

When running Wasm in the browser, one can use JavaScript to allow the Wasm module to interact with the outside world. But the goal of WASI is to be able to run the same Wasm module on different runtimes, which may not have a JavaScript engine available.

The main use case for WASI is to run sandboxed applications in the cloud, but polyfills are available for the browser too.

WASI is still being standardized, and the API is going through multiple iterations. The newest version, “preview2”, is still being developed, while the “preview1” version is in a frozen state, with broad support. For this reason, we are focusing on WASI preview1 for the moment.

## Supporting WASI in Cheerp

The main selling point of Cheerp is its ability to target both JavaScript and WebAssembly within a single C++ codebase.

Working with WASI, on the other end, pretty much implies that you don’t want to depend on JavaScript at all.

Even an hello world program compiled with Cheerp will include some JavaScript, mainly doing the following:

- “Loading code”, that takes care of downloading the Wasm, passing the imports, instantiating it, and running main().
- C++ functions compiled to JS. In an hello world, that would be the write() implementation that prints to the browser console

If we want to target WASI, we need to add a subtarget to the compiler, that will not create the JS code mentioned above, and will instead consider the Wasm module as the only compilation artifact.

On top of that, we need to implement the syscalls using WASI instead of the browser APIs.

Luckily, we don’t need to compile a whole new libc for this. Our libc implementation of choice (Musl) is (almost) entirely unmodified by us, and compiles entirely in WebAssembly.

The same is true for the C++ libraries, with one… exception!

Since Wasm exceptions are not standardized yet, we are implementing C++ exceptions with JavaScript exceptions. This means that for the WASI subtarget we have to compile with exceptions disabled (which is the default in Cheerp anyway).

And this is how the cheerp-wasi-wasm target is born!

![](https://leaningtech.com/wp-content/uploads/2023/04/wasi-2.gif)

## Running fc-cache on WASI

Back to the original issue: pre-building the _fontconfig_ database so that we don’t download all the fonts at runtime.

Does using our new WASI target solve all the issues?

- We can select the “root directory” seen by our application easily (ex: `wasmtime --dir=./fontdir fc-cache.wasm`) ✅
- The ABI of structs (alignment, type sizes, etc.. ) is identical, so the database created by `fc-cache` when running on WASI can be read by _fontconfig_ in the browser ✅
- Since we control the syscall implementations, we can use a consistent time resolution for the browser and WASI platforms ✅

The last missing piece was CI integration. We are now using [Wasmtime](https://wasmtime.dev/) in our build process to generate the database as part of the deployment.

## Conclusions

Experimental support for the WASI target will be available in Cheerp 3.1, which is planned to be released in a few weeks. In the meantime you can try out [Cheerp nightly builds](https://launchpad.net/~leaningtech-dev/+archive/ubuntu/cheerp-nightly-ppa) if you wish. The feature can be enabled by passing the `-target cheerp-wasi-wasm` option to the compiler.

The level of support is sufficient for our use case, but it may not be fully robust yet. If you find any bug please report it on [GitHub](https://github.com/leaningtech/cheerp-meta/issues). For feedback and support you can find us on our [Discord](https://discord.leaningtech.com).
