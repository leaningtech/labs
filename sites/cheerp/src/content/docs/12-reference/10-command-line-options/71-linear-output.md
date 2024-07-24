---
title: "`-cheerp-linear-output`"
---

This flag impacts how code not in the genericjs section are output.

## `-cheerp-linear-output=wasm` (default)

Output a WebAssembly file alongside the main output JavaScript file.

## `-cheerp-linear-output=asmjs`

Cheerp will not output a `.wasm` file at all. Instead, inside the JavaScript, there will be an asm.js module.

This can be useful for debugging but it is not recommended for production unless your runtime does not support WebAssembly. It can be more readable and you can just manually add a `console.log` in the middle of a function, which is not trivial to do using default options.
