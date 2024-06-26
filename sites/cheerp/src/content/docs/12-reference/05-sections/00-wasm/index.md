---
title: wasm
description: The WebAssembly section
---

Functions compiled into the wasm section will be output as WebAssembly.

To place functions in the wasm section, you can:

- Tag individual functions with the `[[cheerp::wasm]]` attribute.
- Use `-target cheerp-wasm` to default to wasm for all functions (default).

## Restrictions

[The wasm memory model](/cheerp/reference/sections/wasm/memory-model) has some restrictions.

### No handling of foreign JavaScript objects or functions

In wasm, you cannot pass objects to code that is not been compiled by us. This includes other JavaScript libraries, the DOM, or browser resources. That is, you cannot call functions or create objects in the `client` namespace from wasm code.

To overcome these restrictions, use [genericjs](/cheerp/reference/sections/genericjs) or [CHEERP_SAFE_INLINE](/cheerp/reference/interop/safe-inline).
