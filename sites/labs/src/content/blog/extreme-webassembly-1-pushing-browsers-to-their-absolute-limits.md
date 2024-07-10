---
title: "Extreme WebAssembly 1: pushing browsers to their absolute limits"
description: |
  This is the first of a series of posts about the problems we have found on our way when using WebAssembly, and how we have solved them.
pubDate: "2020-06-16"
categories:
  - "technical-blog"
  - "webvm"
authors:
  - alessandro
heroImage: ./extreme-wasm.webp
---

![](/blog/1*gDXCXEYEhWvNQpNxEgkB9A.gif)_Python3 running client side using CheerpX. File access and blocking primitives (i.e. sleep) are demonstrated._

WebAssembly is one of the hottest topics in software development right now, particularly in the web applications ecosystem.

While its internals are still mysterious to many, here at [Leaning Technologies](https://leaningtech.com/index.html) we have been working with it daily for the last several years. As a matter of fact, we have been involved in compile-to-JavaScript since 2012, way before WebAssembly was announced, let alone implemented in major browsers.

Our company makes several tools that target WebAssembly on the browser: Cheerp (C++ to JavaScript/WebAssembly compiler, an alternative to Emscripten), CheerpJ (Java to JavaScript/WebAssembly with full runtime) and CheerpX (virtualization technology to run X86 binaries in the browser).

Between all our products, we are probably among the most intensive users of WebAssembly on the planet, and since a long time the issues we have can’t be resolved by a quick search on StackOverflow.

This is in particular true for [CheerpX](https://leaningtech.com/pages/cheerpx.html), a virtualization technology for WebAssembly, which is quite unique and in our view transformative. With CheerpX, you will eventually be able to run full operating systems on the browser, as well as Docker containers, or Linux libraries. The possibilities are very significant.

Although CheerpX is not available to the public yet, we are eager to show you something. We are releasing today a first, unpolished, tech demo. More information at the bottom of this post.

As part of CheerpX, we have implemented a fast x86 interpreter and JIT compiler that can generate WebAssembly modules on the fly to efficiently execute *arbitrary* x86 applications and libraries, fully client-side.

As a first technical application of CheerpX, we are currently focusing on Linux binaries and in particular on [virtualizing the Flash binary plugin](https://medium.com/leaningtech/running-flash-in-webassembly-using-cheerpx-an-update-d500b6fbc44e), but the architecture is fully general and we plan to eventually support whole operating systems. Several early adopters are testing CheerpX right now, and the first applications to use it in production are expected in a few months.

Far from the most widespread model of ahead-of-time compilation (C++, Rust, etc), CheerpX is pushing WebAssembly to its absolute limits, and after more than 12 months of working on this project I have countless stories about things that start breaking when getting close to these limits.

This article is intended as the first of a series about the problems we have found on our way when using WebAssembly, and how we have solved them. It is also going to be, at times, a call to action to the WebAssembly community, with the purpose of shining a light on the limitations and inefficiencies of the WebAssembly VMs currently available, and how to overcome them.

To start with, I will try to explain some of the magic behind CheerpX. How can we even run arbitrary x86 code in the browser? In particular: how do we deal with the arbitrary control flow of x86 code.

## Taming arbitrary control flow

In WebAssembly, the unit of execution is the “function”. CheerpX uses a dynamic and flexible conversion strategy: all the code reachable via direct jumps and hot enough from a given entry point will become 1 Wasm function.

This may or may not map to functions in the original source code, and we don’t really care. In practice this approach will often reconstruct coherent call stacks that can be efficiently implemented with WebAssembly calls. Both direct and indirect calls are supported and CheerpX even tries to “devirtualize” indirect calls to direct ones using the information available at runtime.

Now that these general ideas are introduced we can summarize how CheerpX handles arbitrary control flows:

1. **Direct jumps**, either conditional or unconditional, are converted to corresponding WebAssembly control flow. This is achieved using the same CFGStackifier algorithm we have implemented in Cheerp, you can find plenty of information about this in our previous [post](https://medium.com/leaningtech/solving-the-structured-control-flow-problem-once-and-for-all-5123117b1ee2).
2. **Direct and indirect calls** are mapped to WebAssembly calls. If the target address is statically known, possibly via devirtualization, and already compiled to Wasm, a direct call will be used. Alternatively, a helper is invoked to resolve and eventually forward the execution to the target.
3. **Returns** at the machine code level are actually a form of indirect jumps. In principle they could jump anywhere. In practice, though, they will *usually* cleanly return to the previous method in the WebAssembly stack. CheerpX optimizes for the common case of a well behaved call stack, but can deal correctly with badly behaving code using rets to jump to arbitrary addresses.
4. **Indirect jumps**: These are relatively uncommon, but quite problematic, and the whole reason I am writing this piece.

## The secret life of indirect jumps

The most naïve approach to support indirect jumps is to effectively give up on structured control flow and go back to the outer loop which drives the whole execution.

Indirect jumps are also relatively infrequent in real world code, since the common case of indirect calls (i.e. C++ virtual calls), is already handled. We cannot really settle for the naïve approach though, because indirect jumps are used for a critical purpose: calls to shared library methods.

If you disassemble any dynamically linked binary you will find code like this:

```
08049060 <puts@plt>:
8049060: f3 0f 1e fb endbr32
8049064: ff 25 0c c0 04 08 jmp \*0x804c00c
804906a: 66 0f 1f 44 00 00 nopw 0x0(%eax,%eax,1)
```

For the unlucky few who cannot read Matrix code fluently, the *jmp* instruction will first load a 32-bit value from address 0x804c00c, and then redirect execution to the loaded address. The dynamic linker takes care of writing the actual address of the ‘_puts_’ function at address 0x804c00c, which will never change during the execution of the program.

What we have in the end is an indirect jump which is actually quasi-direct: It will always go to the same place. As an optimization CheerpX can actually detect such cases and “devirtualize” this, but in general thismight not be possible.

## Going too deep

Remember that in WebAssembly the unit of execution is the “function”. Moreover, the only way of transferring the control to a different WebAssembly function is a call. What we *could* do is this:

```
call N
ret
```

This is actually correct, and it *mostly* works, at least until the dreaded “Maximum call stack” exception arises. The fundamental problem is that indirect jumps are not only used in the PLT as described above, but may be used to pass around control unpredictably. If, for any reason, a few thousands of such indirect jumps happen in a row, the WebAssembly/JavaScript stack will blow.

And this happens in practice. I am not sure what specific component causes the problem. I suspect either something deep in the dynamic linker or possibly an optimized bytecode interpreter in the target x86 code. It doesn’t matter anyway, we want to build a generic and robust solution, so we need to do better.

## Wrapping up

![](/blog/1*TyhAQyn2i36-C7BBHZFPMQ.gif)

_V8-ception: node.js running client side in Chrome. Colors courtesy of ANSI escape codes._

We will discuss how the problem is solved in the next post. **(Possibly obvious) spoiler alert: Tail calls are required.**

While waiting for the next post, you can find more information on CheerpX internals in this talk by Yuri, one of our Senior Engineers, who gave an introduction on CheerpX at the Wasm SF meeting back in February (the first minute or so of the audio is missing, apologies): [https://www.youtube.com/watch?v=7JUs4c99-mo](https://www.youtube.com/watch?v=7JUs4c99-mo)

As mentioned above one of the things we are working on is safely running the binary Adobe Flash plugin in the browser to preserve Flash content after 2020. You can find more details [here](https://medium.com/leaningtech/preserving-flash-content-with-webassembly-done-right-eb6838b7e36f) and [here](https://medium.com/leaningtech/running-flash-in-webassembly-using-cheerpx-an-update-d500b6fbc44e).

The main purpose of this series of posts is to stimulate debate in the WebAssembly community, so we welcome comments on Twitter (tag me [@alexpignotti](https://twitter.com/alexpignotti) or [@leaningtech](https://twitter.com/leaningtech))

It is finally time to show you something interactive. This is the first public Tech Demo of CheerpX ever released. Python3 running client side in the browser. It is unpolished, it needs custom flags and the backspace does not work, but we hope that you will find it nevertheless a miracle, just as we do. [https://repl.leaningtech.com/python3.htm](https://repl.leaningtech.com/python3.html)
