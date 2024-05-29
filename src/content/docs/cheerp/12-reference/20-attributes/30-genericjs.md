---
title: "`[[cheerp::genericjs]]`"
description: Mark a function, class, or struct to be compiled to JavaScript
---

From WebAssembly it is not possible to call any browser APIs - not even the basic `client::console.log`.

Instead, you can mark functions, classes, and structs with the `[[cheerp::genericjs]]` attribute to have them be compiled into JavaScript. You can call browser APIs in genericjs functions.

Specifically, functions marked with `[[cheerp::genericjs]]` will be placed in the [genericjs section](/cheerp/explanation/sections).

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
