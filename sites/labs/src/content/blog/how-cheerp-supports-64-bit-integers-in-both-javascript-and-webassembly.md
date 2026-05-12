---
title: "How Cheerp supports 64-bit integers in both JavaScript and WebAssembly"
description: |
  Improving support for 64-bit integers in Cheerp, a C/C++ to WebAssembly/JavaScript compiler.
pubDate: "2020-07-13"
categories:
  - "technical-blog"
authors:
  - yuri
heroImage: ./cheerp-int64.webp
tags:
  - Cheerp
---

I recently improved support for 64-bit integers in [Cheerp](https://leaningtech.com/pages/cheerp.html), a C/C++ to WebAssembly/JavaScript compiler.

In this post, I will explain why supporting 64-bit integers requires special attention, what Cheerp used to do in the past, why the current situation is better, and what we will be able to do in the future to further improve support.

## About Cheerp

Cheerp is a C/C++ to WebAssembly/JavaScript compiler, similar to Emscripten. Its focus is primarily better interoperability with the browser APIs and third party JavaScript libraries. This is achieved by compiling the code to either WebAssembly, using a standard flat memory model, or to JavaScript, using an object memory models that maps C++ struct/classes instances to JavaScript garbage-collected objects.

## Supporting 64-bit integers in JavaScript

Before WebAssembly was a thing, Cheerp supported compiling C++ code to plain JavaScript. JavaScript has no built-in support for 64 bit integers (well, there is [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) now… more on that later), so we needed a way of supporting these integers and their operations in term of simpler types.

Despite JavaScript nominally only supporting double-precision floating point numbers, we can efficiently and precisely represent 32-bit integers. We can then decompose a single 64-bit value as an array of two 32-bit values, and implement all the operations in terms of the higher and lower 32 bits explicitly.

This may be not very efficient, but it allows one to compile programs that make use of types like `int64_t` (aka `long long` ) and `uint64_t` (aka `unsigned long long` ).

Clang usually compiles these C++ types into the LLVM `i64` type. But since we cannot represent `i64` in JavaScript, we modified Clang to compile operations on `int64_t/uint64_t` in terms of 32-bit instructions on the `i32`type. This decomposition was done directly in Clang when generating LLVM IR code. The reasoning behind this was to do this operation as soon as possible to enable more optimizations, and to never have `i64` values in our IR to avoid possible issues.

For example, for the following C code:

int64_t i = ...;
int64_t j = ...;
j = j & i;

Clang normally emits LLVM IR like this:

%i.addr = alloca i64, align 8
%j.addr = alloca i64, align 8\[...\]%i = load i64, i64\* %i.addr, align 8
%j = load i64, i64\* %j.addr, align 8%and = and i64 %i, %j

store i64 %and, i64\* %j.addr, align 8

While in Cheerp it used to emit something like this:

%i.addr = alloca \[2 x i32\], align 8
%j.addr = alloca \[2 x i32\], align 8\[...\]%i.gep.high = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %i.addr, i32 0, i32 1
%i.high = load i32, i32\* %i.gep.high, align 4
%i.gep.low = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %i.addr, i32 0, i32 0
%i.low = load i32, i32\* %i.gep.low, align 8%j.gep.high = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %j.addr, i32 0, i32 1
%j.high = load i32, i32\* %j.gep.high, align 4
%j.gep.low = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %j.addr, i32 0, i32 0
%j.low = load i32, i32\* %j.gep.low, align 8%and.high = and i32 %i.high, %j.high
%and.low = and i32 %i.low, %j.low

store i32 %and.high, i32\* %j.gep.high, align 8
store i32 %and.low, i32\* %j.gep.low, align 4

This design decision proved to be an hindrance for supporting real 64 bit integers for WebAssembly output.

## Supporting 64-bit integers in WebAssembly

WebAssembly natively supports i64 values, so we don’t need need to manually decompose them into i32 and emulate all the instructions.

This is good and all, but in Cheerp we still need to be able to generate JavaScript code for interoperability with the browser APIs and external JavaScript libraries.

Moreover, since we were never actually generating `i64` values from clang, we were faced with the daunting task of “reconstructing” i64 values and instructions from their lowered i32 version. Or alternatively modify Clang even further to sometimes compile `in64_t` to a pair of `i32` , and sometimes to `i64` .

On top of all this, we wanted a solution that would allow us in the future to take advantage of a new JavaScript feature: `BigInt`.

## JavaScript has actual integers now!

`[BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)` is a new numerical type recently added to JavaScript. It allows one to precisely represent and compute arbitrarily sized integers. The new `[BigInt64Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)` also allows one to efficiently use 64-bit values in arrays.

We can use these features to solve the issue of representing types like `int64_t` for code that is compiled to JavaScript.

The only problem is that [not all modern browsers support it yet](https://caniuse.com/#feat=bigint): Safari will support it from version 14, and old browsers like Internet Explorer will just never support it at all.

Automatic conversion between JavaScript `BigInt` and Wasm `i64`, which would be needed for interoperability, is even less supported currently (see the current state [here](https://webassembly.org/roadmap/)).

So while this is a very useful feature, and Cheerp will definitely support optionally using BigInt, it is not a definitive solution to the problem.

## Lowering i64 in an LLVM pass

Instead of modifying Clang to compile `int64_t` values and instructions directly to `i32` , we can leave the normal code generation as it is, and later run a custom LLVM pass to remove all the `i64` and convert them to `i32` .

This has the benefit of making it very easy to run the pass conditionally, and to simplify the custom logic in Clang. We can still run this pass very early in the optimization process, to get more efficient code.

There is still one issue left: interoperability. We want to be able to access a `struct` compiled to Wasm from a function compiled to JavaScript, for example.

Our solution to this problem is to always represent `int64_t` as `[i32 x 2]` in memory: when performing a load, we load two `i32` , and we use them to build the `i64` value:

%1 = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %0, i32 0, i32 1
%2 = load i32, i32\* %1, align 4
%3 = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %0, i32 0, i32 0
%4 = load i32, i32\* %3, align 4
%5 = zext i32 %2 to i64
%6 = zext i32 %4 to i64
%7 = shl i64 %5, 32
%i = or i64 %7, %6

When performing a store, we first split the `i64` in two `i32` and we store them sequentially:

%8 = lshr i64 %i, 32
%9 = trunc i64 %8 to i32
%10 = trunc i64 %i to i32
%11 = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %i.addr, i32 0, i32 1
%12 = getelementptr inbounds \[2 x i32\], \[2 x i32\]\* %i.addr, i32 0, i32 0
store i32 %9, i32\* %11, align 1
store i32 %10, i32\* %12, align 1

This way we can share data between JavaScript and Wasm code, and both will interpret 64 bit integers correctly.

For code compiled to Wasm, Cheerp actually bitcasts the pointer to the data before the load/store, and simply load/store an `i64` directly at the address of the lower `i32` value (WebAssembly is little-endian). This way we keep the full efficiency of native `i64` support.

Example LLVM IR of a load (for code compiled to Wasm):

i.addr = alloca \[2 x i32\], align 8
%1 = bitcast \[2 x i32\]\* %0 to i64\*
%i = load i64, i64\* %1, align 4

Example LLVM IR of a store (for code compiled to Wasm):

%2 = bitcast \[2 x i32\]\* %i.addr to i64\*
store i64 %i, i64\* %2, align 8

## Conclusion and future development

This new approach lets us take advantage of native 64-bit arithmetic AND load/stores in Wasm, while keeping the code generation flexible enough to support plain JavaScript and the legacy asm.js target. All these improvements are now merged in master and are available to nightly PPA users. The next step for us is to optionally enable the use of BigInts, which will be the focus of my next post.

Do you have any questions about this feature or anything Cheerp related? Drop me a question on [Twitter](https://twitter.com/YIozzelli).
