---
title: "Cheerp 3.0: The most advanced C++ compiler for the Web, now permissively licensed"
shortTitle: Cheerp 3.0 released
description: |
  We are proud to announce Cheerp 3.0, the latest major release of our C++ compiler for the Web. This new version is packed with new features and optimizations that, once more, move the state of the art of using C++ as a programming language for Web applications and games. All the compiler core components and libraries are now licensed permissively under the Apache 2.0 / LLVM license, allowing for Cheerp 3.0 to be used for any purpose, with no restrictions.
authors:
  - alessandro
pubDate: "March 14 2023"
heroImage: "https://leaningtech.com/wp-content/uploads/2023/03/Cheerp-3.0-1.png.webp"
tags:
  - Cheerp
featured: true
---

Today we are very proud to announce Cheerp 3.0, the latest major release of our C++ compiler for the Web.

More than a year has passed since the previous release of Cheerp ([Cheerp 2.7](https://leaningtech.com/cheerp-2-7-compile-c-to-webassembly-plus-javascript/)), and this new version is packed with new features and optimizations that, once more, move the state of the art of using C++ as a programming language for Web applications and games.

Most importantly, with this release we are making a significant change to the licensing model of Cheerp. Starting from Cheerp 3.0, all the compiler core components and libraries are now licensed permissively under the [Apache 2.0 / LLVM license](https://opensource.org/license/apache-2-0/). This marks a radical departure from our previous GPLv2 / dual commercial licensing model, allowing for Cheerp 3.0 to be used for any purpose, with no restrictions.

## Why are we changing the license of Cheerp?

Since its release in 2014 Cheerp has been licensed under a dual licensing scheme: GPLv2 for non-commercial users, and a proprietary license for anybody not willing to comply with GPLv2 terms.

For us at [Leaning Technologies](https://leaningtech.com/), this has always represented a less than ideal,but necessary choice. As a bootstrapped company with no external capital, we felt that dual licensing was the only way to monetize the tool, even if that came at the expense of a wider community adoption.

A lot has happened since 2014: we have grown significantly and released multiple products ( [CheerpJ](https://leaningtech.com/cheerpj), [CheerpX for Flash](https://leaningtech.com/cheerpx-for-flash/) and [WebVM](https://webvm.io)). We are in a very different place financially and in terms of maturity. During this time, Cheerp remained the cornerstone of **all** our technologies. Everything that we make at Leaning Technologies is written in C++ and compiled with Cheerp, and it would not have been possible otherwise.

Having reflected on what role we want to play in the WebAssembly ecosystem, we realized that now is the right time to change gears, and prioritize a wider adoption of this tool. By relicensing it to a permissive liberal license we hope to remove any barrier to the adoption of Cheerp, which can now be used by anybody with ‘no strings attached’.

## What makes Cheerp unique?

Cheerp is a compiler designed to make C++ a first class language for Web programming.

The purpose of Cheerp is not _just_ to generate optimized WebAssembly from C++. Rather, it is to provide a tool that allows C++ to be seamlessly integrated with any external HTML5/JavaScript.

To achieve this, it has several unique features and optimizations:

- **A state-of-the-art WebAssembly backend**: This is expected by a modern C++ compiler that can target the Web. Cheerp generates extremely high quality WebAssembly code in one step, with no post-processing required (e.g. Binaryen wasm-opt). Cheerp supports post-MVP features of WebAssembly including tail calls, SIMD and externrefs. All these features can be selectively enabled using the _-cheerp-wasm-enable=_ command line flag to make sure you can target as many browsers as possible depending on your requirements.
- **A performant JavaScript backend:** Cheerp is the only tool in the market that can generate pure JavaScript code from C++. In particular, it is possible to compile selected portions of code to JavaScript by tagging specific functions or classes with the _\[\[cheerp::genericjs\]\]_ attribute. It is also possible to compile a whole codebase to pure JavaScript, by using the _-target cheerp_ command line option. The JavaScript output of Cheerp is highly optimized. We have studied in depth how engines such as V8 and SpiderMonkey work internally to make sure the generated JavaScript can be compiled as efficiently as possible.
- **Transparent access to DOM APIs and JavaScript libraries:** By taking advantage of the JavaScript backend, Cheerp allows to manipulate the  DOM and invoke any  JavaScript API directly in C++. In Cheerp this is done by using the APIs declared in the _client_ namespace. The _<cheerp/clientlib.h>_ header declares all the standard DOM APIs at this time, but there is nothing magic about it and you are free to add your own declarations to the _client_ namespace if you need to use experimental DOM APIs or any third party JavaScript libraries. As a quick example of what is possible with Cheerp, this is valid C++ code:

```
client::HTMLElement* newElem =  client::document.createElement(“div”);
```

- **The \[\[cheerp::jsexport\]\] attribute:** With this feature it is possible to use C++ functions and complete classes directly from manually written JavaScript. The compiler will enforce a set of rules on the exposed interfaces to guarantee that it’s safe to do so. We have [written at length](https://leaningtech.com/jsexport-c-in-the-browser-made-easy/) about this feature previously.
- **Advanced optimizations to reduce code size**: Cheerp heavily takes advantage of whole program optimization techniques. We have developed advanced optimization such as [PreExecuter](https://docs.leaningtech.com/cheerp/Cheerp-PreExecuter.html)  (convert global C++ constructors to constants), [PartialExecuter](https://medium.com/leaningtech/partialexecuter-reducing-webassembly-size-by-exploring-all-executions-in-llvm-f1ee295e8ba) (remove code that can be proven to never be run based on partial knowledge of function parameters), and a sophisticated devirtualizer. All of these contribute to a significant reduction in code size.

## How does Cheerp compare to Emscripten?

Both Cheerp and Emscripten are based on the industry standard LLVM/Clang infrastructure, and, fundamentally, do the same thing: compiling C++ code into something that can run in the browser.

At a high level, the main difference between the two tools is a matter of philosophy. Emscripten has a strong focus towards converting whole C++ applications to WebAssembly so they can run on the browser. Conversely, Cheerp focuses on allowing existing C++ code to be used as part of a new, Web-native user experience. This is what almost all of our customers actually required for their use cases.

To achieve this, Cheerp provides a collection of features to allow seamless interoperability between C++ and any external JavaScript/DOM. In particular, the \[\[cheerp::jsexport\]\] tag signals that the generated code is exposed with no overhead to external JavaScript. This unique feature requires Cheerp to be able to generate a combination of WebAssembly and JavaScript from a single C++ source, while enforcing a set of rules on the exposed interfaces to ensure their behavior is predictable and without surprises.

On the technical side, the main differences are about how intermediate outputs are represented and how linking happens. Emscripten uses by default WebAssembly as the object format, the various files are then linked and optimized in post-processing by wasm-opt (part of binaryen).

From the get go, we followed a different approach, motivated by the desire to have an integrated tool for C++ on the Web. Cheerp directly uses the LLVM bytecode format as the intermediate representation, for both object files and libraries. This makes it possible to fully embrace whole program optimization by taking advantage of all the metadata available at the LLVM level. Cheerp will “internalize” all definitions during LTO, allowing a wide range of standard and custom optimizations to take place at the LLVM level. After this process, high quality WebAssembly and JavaScript is generated without any need for post-processing steps.

We routinely benchmark Cheerp against the Emscripten test suite. The results reflect the aforementioned differences in approach. In terms of output size, thanks to LLVM level whole program optimization and our custom passes, Cheerp normally achieves  better results across the board, with an average 7% smaller build size.

Output size benchmarks, lower is better. Data available [here](https://docs.google.com/spreadsheets/d/e/2PACX-1vTg2EnhrKAhvDhlig9QQDn6aBjk6XQUH4hg7XncVRO_8QU7D6P0KO415-Ab5tg_tfK7JMyXBZRnqJqu/pubchart?oid=1211690179&format=interactive).

![](https://leaningtech.com/wp-content/uploads/2023/03/Cheerp-3.0-vs-Emscripten-3.1.31-size.svg)

The reduced output size does not have a negative impact on execution performance, which is comparable with Emscripten across a wide range of benchmarks and execution engines. As an example here we have the execution times on the v8 engine, lower is better. Full dataset available for [v8](https://docs.google.com/spreadsheets/d/e/2PACX-1vTg2EnhrKAhvDhlig9QQDn6aBjk6XQUH4hg7XncVRO_8QU7D6P0KO415-Ab5tg_tfK7JMyXBZRnqJqu/pubchart?oid=2111843775&format=interactive), [SpiderMonkey](https://docs.google.com/spreadsheets/d/e/2PACX-1vTg2EnhrKAhvDhlig9QQDn6aBjk6XQUH4hg7XncVRO_8QU7D6P0KO415-Ab5tg_tfK7JMyXBZRnqJqu/pubchart?oid=1072988706&format=interactive) and [JavaScriptCore](https://docs.google.com/spreadsheets/d/e/2PACX-1vTg2EnhrKAhvDhlig9QQDn6aBjk6XQUH4hg7XncVRO_8QU7D6P0KO415-Ab5tg_tfK7JMyXBZRnqJqu/pubchart?oid=1867188279&format=interactive).

![](https://leaningtech.com/wp-content/uploads/2023/03/Cheerp-3.0-vs-Emscripten-3.1.31-V8.svg)

In other words, Cheerp provides a unique degree of integration between compiled C++ and external JavaScript, with a smaller output footprint, without sacrificing any performance compared to Emscripten.

The only significant missing feature in Cheerp 3.0 is support WebAssembly atomics and multithreading, but we are currently working on this feature and we expect this last gap to be filled over the next few months with the release of Cheerp 3.1.

It should be noted that the use of multithreading in browsers currently requires jumping through more than a few hoops to enable SharedArrayBuffer (i.e. COEP/COOP/CORP headers for cross-origin isolations). These hoops can become real limitations to load third-party resources, which is not uncommon in Web applications. This means that, in practice, it might be wise not to depend on multithreading unless you really need the feature.

## Give Cheerp a try!

Cheerp has been used to build a lot of amazing products, including all of Leaning Technologies’ tools (e.g. [WebVM](https://webvm.io/), a x86 virtual machine running in the browser at high performance).

The question is, what will you build with Cheerp?

You can download Cheerp [here](https://leaningtech.com/cheerp/#download). For Debian/Ubuntu, consider using our [PPA](https://launchpad.net/~leaningtech-dev/+archive/ubuntu/cheerp-ppa)

If you are unsure where to start take a look at our [Documentation](https://docs.leaningtech.com/cheerp/) and [Getting Started](https://docs.leaningtech.com/cheerp/Getting-started) guide.

For further support make sure to join our Discord: [https://discord.leaningtech.com](https://discord.leaningtech.com), where you will find Leaning Technologies core developers, including myself. We are always happy to help!

We hope you will enjoy using Cheerp, see you soon!
