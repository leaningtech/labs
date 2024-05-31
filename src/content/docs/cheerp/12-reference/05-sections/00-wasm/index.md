---
title: wasm
description: The WebAssembly section
---

Functions compiled into the wasm section will be output as WebAssembly.

To place functions in the wasm section, you can:

- Tag individual functions with the `[[cheerp::wasm]]` attribute.
- Use `-target cheerp-wasm` to default to wasm for all functions (default).

<!-- TODO: restrictions -->
