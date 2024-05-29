---
title: "`[[cheerp::wasm]]`"
description: Mark a function to be compiled to WebAssembly
---

You can mark functions with the `[[cheerp::wasm]]` attribute to have them be compiled into WebAssembly. Unless you are using the `-target cheerp` option, this is also the default behaviour.

Specifically, functions marked with `[[cheerp::wasm]]` will be placed in the [wasm section](/cheerp/explanation/sections).

## Example

```cpp
#include <cheerp/clientlib.h>

// This function will be compiled to JavaScript
[[cheerp::genericjs]] int domOutput(const char* str) {
  client::String* s = new client::String(str);
  client::console.log(s);
  // Also add it to the DOM for good measure
  client::document.get_body()->set_textContent(s);
  return s->get_length();
}

// This function will be compiled to WebAssembly
void webMain() {
  int len = domOutput("Hello WASM!");
  assert(len == 11);
}
```
