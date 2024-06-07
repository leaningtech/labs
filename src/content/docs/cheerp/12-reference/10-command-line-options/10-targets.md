---
title: Targets
description: WebAssembly, JavaScript, and WASI
---

Cheerp can build applications into the following targets:

- [WebAssembly + JavaScript](#webassembly--javascript) (`cheerp-wasm`) (default)
- [WASI](#webassembly-only-wasi) (`cheerp-wasm-wasi`)
- [JavaScript](#javascript-only) (`cheerp`)

## WebAssembly + JavaScript

The default target, `-target cheerp-wasm`, produces both a JavaScript file and a WebAssembly file.

The JavaScript file includes all C++ code compiled to JavaScript (code with the `[[cheerp::genericjs]]` attribute), and the code necessary to load the WebAssembly module and run the program.

You can specify a different name and runtime path for the wasm file with the `-cheerp-secondary-output-file=<file>` and `-cheerp-secondary-output-path=<path>` options respectively.

For debugging purposes, human-readable WebAssembly output can be generated using `-cheerp-linear-output=wasm`.

### Example

```bash
/opt/cheerp/bin/clang++ \
  -target cheerp-wasm \
  -cheerp-linear-heap-size=128 \
  -o output.js \
  input.cpp
```

The command above will generate a JavaScript file `output.js` and a corresponding binary WebAssembly module `output.wasm` from the C++ source file `input.cpp`.

### Avoiding Wasm traps

The Wasm standard mandates that certain undefined operations should trap and stop the execution of the program (possibly notifying back what happened wrongly). This could serves as run-time checker (es out-of-bound memory accesses lead to a trap) but it's also could lead to some false positives being raised. An example: converting between int and double may lead to a trap being raised, while in C++ it has a well defined (at a cost of possible loss of precision) meaning.
If you want to avoid the trap mechanism, passing `-cheerp-avoid-wasm-traps` do as the name suggests, and generates non-trapping Wasm code.

### WebAssembly heap size

Since WebAssembly uses linear memory with a certain size, the heap size can be set using `-cheerp-linear-heap-size=128`. The unit of the `-cheerp-linear-heap-size` is megabytes, and when omitted defaults to 1 megabyte.

## WebAssembly only (WASI)

Cheerp can compile to WebAssembly conforming to the [WebAssembly System Interface (WASI)](https://wasi.dev/) with the `-target cheerp-wasm-wasi` option. No JavaScript will be generated, so genericjs is not supported.

The output can be executed in supporting runtimes, such as [Wasmtime](https://wasmtime.dev/).

The WASI target is not intended for browser use.

### Example

```shell "-target cheerp-wasm-wasi"
$ /opt/cheerp/bin/clang -target cheerp-wasm-wasi test.c
$ wasmtime a.out
```

## JavaScript only

To compile to JavaScript only, use the `-target cheerp` option. No WebAssembly will be generated unless it is opted into with `[[cheerp::wasm]]`.

Specifically, this option places all code in the genericjs section by default.
