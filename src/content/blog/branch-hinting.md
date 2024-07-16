---
title: "WebAssembly Branch Hinting: From an idea to W3C standard"
description: |
  Around a month ago, the WebAssembly Community Group voted to advance the Branch Hinting proposal to phase 4, effectively recommending its addition to the standard (The Working Group will formally add it to the standard by voting into phase 5 at some point in the near future).

  This was a big achievement for me, as the proposal Champion from its inception almost 4 years ago, and for Leaning Technologies (my company), who sponsored this work.

  In this article I will explain the purpose of the proposal, and the journey that brought it from idea to standard.
authors:
  - yuri
pubDate: "July 16 2024"
heroImage: "./branch-hinting.png"
tags:
  - CheerpX
---

Around a month ago, the WebAssembly Community Group voted to advance the [Branch Hinting proposal](https://github.com/WebAssembly/branch-hinting) to phase 4, effectively recommending its addition to the standard (The Working Group will formally add it to the standard by voting into phase 5 at some point in the near future).

This was a big achievement for me, as the proposal Champion from its inception almost 4 years ago, and for [Leaning Technologies](https://leaningtech.com) (my company), who sponsored this work.

In this article I will explain the purpose of the proposal, and the journey that brought it from idea to standard.

## The problem

It all started from a very practical problem: improving the performance of an application. The application is CheerpX, an X86 virtual machine running in the browser.

What's special about CheerpX is that it Just-in-time (JIT) compiles X86 linux applications into Wasm (See [this talk](https://youtu.be/7JUs4c99-mo?si=2zZSBuqbpQB50c-o) for a more in-depth explanation of the architecture). As most JIT compilers do, CheerpX makes some assumptions to produce better code, and needs to check that they hold before proceeding. The code that is generated has many instances of the following pattern:

```cpp
while(...) {
    if (unlikely)
        slow_path();
    else {
        ...
    }
}
```

Modern CPUs are quite good at predicting unlikely branches, so the cost of the`if` is quite low. The problem is that the code of the unlikely branch is still loaded into the instruction cache, just by virtue of appearing next in memory.

When compiling C/C++ into native code, one can use `__builtin_expect` or`[[unlikely]]` to hint the compiler to move that code out of the hot path (and potentially do other useful things, such as not inlining the call to`slow_path()`, or penalizing the register allocation in favor of other blocks).

A JIT compiler for a native platform would emit machine code directly, and do this optimizations manually.

When compiling to WebAssembly though, this is not possible, because of its restrictions around control flow: with the exception of loops, in WebAssembly all predecessors of a block come before the block itself syntactically, with the exception of loops.
There are ways of going around this, but the resulting code will have some overhead that would defeat the purpose. (See the motivation page on the proposal repo for a more in-depth explanation).

But the final machine code is produced by the engine, so if only we could pass a hint to it, akin to `[[unlikely]]` in C++, we could solve this issue by delegating optimal code ordering to the engine itself.

## A proposal is born

We started looking into the internals of V8 (Chrome's JavaScript engine), to see if there was a way to force it to move the slow paths at the end of functions, and we realized that the concept already existed and was extensively used when compiling JavaScript code. It was even used for the WebAssembly instruction `br_if_null` (with the null case assumed to be unlikely).

So we quickly put together a proof of concept of a new `br_if_unlikely`instruction, that would behave like a regular `br_if`, but with the `unlikely` hint added.

Initial testing on our real-world use case was showing a 7-10% speedup, which is quite significant.

So we started a [discussion](https://github.com/WebAssembly/design/issues/1363) within the WebAssembly Community Group.

While we didn't immediately convince everybody that this feature was necessary, the CG [agreed](https://github.com/WebAssembly/meetings/blob/master/main/2020/CG-11-10.md) that it was worthwhile to explore this further, and the "Branch Hinting proposal" started at phase 1 , with its own [repository](https://github.com/WebAssembly/branch-hinting) under the WebAssembly organization.

Proposals follow a [process](https://github.com/WebAssembly/meetings/blob/main/process/phases.md) split in 5 phases before becoming part of the standard. This was just the beginning of the journey.

## The journey

![The Journey](./cg-phases.png)

### How do we hint?

A (surprisingly) controversial detail was how to encode the hints:

Should we add new instruction variants (Similar to the PoC)? Or maybe a single instruction that should appear just before hinted branches? Or some other form of metadata not directly encoded in the instruction flow?

The last option was ultimately chosen, with the following reasoning:

The branch hints are just... hints. They don't affect the semantics of the program. An engine could implement them by doing nothing at all and it would be compliant. It feels wrong then to encode them as instructions, and force all engines to to recognize and parse them, even engines that can't or won't make use of them (e.g. interpreters).
One can imagine additional kinds of hints added in the future (e.g. inlining, pre-fetching, ...), and adding them as instructions would only increase this burden.

WebAssembly already has a way to attach some metadata to a module: Custom sections.

A custom section is identified by a name, and can contain arbitrary data. It does not affect the semantics of the program, and even if an engine recognises it, failing to validate or parse it does not prevent the execution of the module.

Perfect for our use case.

### How do we refer to instructions?

Having decided to put the hints in a custom section, we now needed a way to refer to a particular instruction from the section.

In WebAssembly "things" are usually identified by an index: functions, globals, locals, memories,... It would be natural to identify instructions by index too.

Instruction N would be the Nth instruction from the beginning of the code section, or from the start of its function. Alternatively, we can use the byte offset from the start of the section (or function).

There are some tradeoffs:

- Indexes are used to reference all other items
- Indexes are "stable": different (valid) binary encodings of the same Wasm module can result in a different offset

but:

- A byte offset does not require to decode all the instructions before the hinted one to identify it
- The DWARF standard for debugging information uses byte offsets for referencing instructions
- Engine implementors and compiler writers expressed a preference for byte offsets, since it's a more natural representation for referencing instruction in their implementations

Consensus was stronger for byte offsets, so we proceeded with that option.

### How do we represent this as text?

Until recently, WebAssembly did not have a way to represent custom sections in the text format.

The [Annotations proposal](https://github.com/WebAssembly/annotations) was the solution to this deficiency, but it was stagnating due to a few issues. The biggest of which was how to add tests for the proposal (a requirement for standardization), since it deals with custom sections, and those are by definition not affecting the semantics of the module. I will come back to this issue later.

As mentioned above, byte offsets are not "stable": different encodings of the same Wasm module can result in different offsets for the same instruction (the [LEB128](https://en.wikipedia.org/wiki/LEB128) encoding used for integers has multiple representations for small values). This means that when converting to the text format, we cannot simply rely on the byte offsets, but we need another representation.

An elegant solution is to leverage the custom annotations from the Annotations proposal, and to define a branch hinting annotation that appears next to the hinted instruction in the text. This way, the hint implicitly reference the instruction, independently of the binary encoding:

```
(@metadata.code.branch_hint "\0") br_if $label
```

### How do we integrate this with the test suite?

At this point, the main obstacles for standardization was the dependency on the Annotations proposal, and the lack of tests in the official test suite. The Annotations proposal itself was also stuck for lack of testing, for very similar reasons.

This was a tricky issue to solve, because how do you even test something that by definition does not affect the program execution in an observable way? And, on a more practical level, the WebAssembly reference interpreter did not support custom sections at all (and as a result, even the already-standard "name" section did not have tests up to this point)

It was decided that custom sections would be tested by validating that their contents are valid and ensuring proper round-tripping between binary and text format.

Together with Andreas Rossberg (the Annotations proposal champion), I [extended the reference interpreter](https://github.com/WebAssembly/annotations/pull/17) to handle custom sections and (optionally) validate them.

This finally unlocked both proposals for standardization.

### Where do we put the spec?

There was actually one last issue to solve: where to put the spec for the new feature.

WebAssembly is actually 3 different specs:

- [Core specification](https://webassembly.github.io/spec/core/): defines the structure of WebAssembly modules, their instruction set, and their representation in binary and text format, as well as the semantics of validation, instantiation, and execution.

- [JavaScript Embedding](https://webassembly.github.io/spec/js-api/index.html): defines JavaScript classes and objects for accessing WebAssembly from within JavaScript, including methods for validation, compilation, instantiation, and classes for representing and manipulating imports and exports as JavaScript objects.

- [Web Embedding](https://webassembly.github.io/spec/web-api/index.html): defines extensions to the JavaScript API made available specifically in web browsers, in particular, an interface for streaming compilation and instantiation from origin-bound Response types.

Out of these 3, the Core spec would make the most sense. Still, our feature does not actually change the semantics of WebAssembly, just how an engine might decide to compile the code. Currently the only custom section described in the core spec is the name section, in the appendix. Adding a growing number of section formats there didn't seem appropriate.

So a new document was made: a fourth spec document for WebAssembly.

- [Code Metadata](https://webassembly.github.io/branch-hinting/metadata/code/): defines metadata attached to instructions

This document first describes a general structure for custom sections that reference instructions (Code Metadata), and then it describes the Branch Hints section based on that.

This will be useful to upcoming proposals that also want to add metadata to instructions, and avoid the proliferation of multiple incompatible formats.
For example, the [Compilation Hints proposal](https://github.com/WebAssembly/compilation-hints) leverages all the shared infrastructure that was built for Branch Hinting.

## Conclusions

The proposal is now implemented in all major web engines (V8, SpiderMonkey, JavaScriptCore), in some tools (Wabt, wasm-tools, Cheerp), and of course it is used in CheerpX!

Browsers are still gating the feature behind a flag, but this should change in the near future.

It was a long journey, but working together with many different stakeholders (compiler authors, browser developers, researchers, ...) to improve the proposal and gather consensus around it has been a valuable experience.
