---
title: A tour of Cheerp
shortTitle: Tour
description: A 5-minute tour of Cheerp and its features
---

## What Cheerp does

Cheerp is a C and C++ compiler for web applications. It can compile C and C++ codebases to WebAssembly and JavaScript which can run in the browser or Node.js.

Cheerp is open source, cross-platform, and available under the Apache 2.0 license.

## Who Cheerp is for

Cheerp is perfect for:

- Web developers who want to use C and C++ libraries in their web applications or websites.
- C/C++ developers who want to write new web applications in C and C++.
- C/C++ developers who want to port their existing application or library to the web.

## Features

### Compile to WebAssembly and JavaScript with the same codebase

Cheerp can compile parts of your code into JavaScript, and other parts into WebAssembly. This is helpful because they have different memory models, and therefore they have different limitations.

By default, Cheerp code compiles to WebAssembly. This default can be changed with [the `-target` command-line option](/docs/reference/command-line-options/targets).

To compile a class or function to JavaScript, attach [the `[[cheerp::genericjs]]` attribute](/docs/reference/attributes/genericjs). This will compile it to JavaScript and place it in the genericjs section.

```cpp
#include <cheerp/client.h>

[[client::wasm]] // Default
void wasm() {
  // Compiled to WebAssembly
}

[[client::genericjs]]
void js() {
  // Compiled to JavaScript
}
```

### Use Web APIs in C++ with zero overhead

Cheerp provides a C++ namespace `client` which exposes JavaScript and Web APIs. You can use these APIs to interact with the browser and JavaScript environment. This feature only works in genericjs code.

```cpp title=hello.cpp
#include <cheerp/clientlib.h>

[[client::genericjs]]
void webMain() {
  client::console.log("Hello, World!");
}
```

Calling `client` functions is **zero-overhead** and have the same semantics as they have in JavaScript.

### Expose C++ classes and methods to JavaScript

You can export classes and functions by marking them with [the `[[cheerp::jsexport]]` attribute](/docs/reference/attributes/jsexport).

```cpp title=factorial.cpp
#include <cheerp/clientlib.h>

[[cheerp::jsexport]]
[[cheerp::genericjs]]
int factorial(int n) {
  if (n < 2)
    return 1;
  return n * factorial(n-1);
}
```

This will add a function `factorial` to JavaScript's global object.

```html
<script src="factorial.js"></script>
<script>
	console.log(factorial(5)); // 120
</script>
```

You can also combine this feature with [JavaScript Modules](/docs/reference/command-line-options/modules):

```javascript title=main.js
import init from "./factorial.js";

const { factorial } = await init();
console.log(factorial(5)); // 120
```

### Inline JavaScript code in C++

In genericjs, you can use [the `__asm__` keyword](/docs/reference/interop/asm) to write native (JavaScript) code, and pass arguments and get values back as usual.

```cpp
__asm__("alert('Hello, world!')");
```
