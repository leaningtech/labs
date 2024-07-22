---
title: Memory model
description: How wasm objects are represented
---

In the wasm section, objects are compiled to linear memory. There is an array of bytes, and every object is stored somewhere in that array. That maps fairly easily to the standard memory model, and allows the same kind of operations:

- accessing a random point of the array (both for writing and reading).
- pointers (that becomes just index into the array).
