---
title: "`[[cheerp::wasm]]`"
description: Mark a function, class, or struct to be compiled to WebAssembly
---

You can mark functions, classes, and structs with the `[[cheerp::wasm]]` attribute to have them be compiled into WebAssembly. Unless you are using the `-target cheerp` option, this is also the default behaviour.

Specifically, functions marked with `[[cheerp::wasm]]` will be placed in the [wasm section](/docs/reference/sections/wasm).
