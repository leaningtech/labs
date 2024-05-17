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

### Use Web APIs in C++

Cheerp provides a C++ namespace `client` which exposes JavaScript and Web APIs. You can use these APIs to interact with the browser and JavaScript environment.

```cpp title=hello.cpp
#include <cheerp/clientlib.h>

void webMain() {
  client::console.log("Hello, World!");
}
```

Functions in `client` are **zero-overhead** and have the same semantics as they have in JavaScript.
The headers that define client interfaces are

```cpp
#include <cheerp/client.h> // Misc client side stuff
#include <cheerp/clientlib.h> // Complete DOM/HTML5 interface
#include <cheerp/webgl.h> // WebGL interface
```

### Expose C++ classes and methods to JavaScript

You can export classes and functions by marking them with the `[[cheerp::jsexport]]` attribute.

```cpp title=factorial.cpp
#include <cheerp/clientlib.h>

[[cheerp::jsexport]]
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

You can also combine this feature with [ES6 Modules](/cheerp/guides/ES6-Modules):

```javascript title=main.js
import init from "./factorial.js";

const { factorial } = await init();
console.log(factorial(5)); // 120
```

<!-- TODO: link to more info -->

### Inline JavaScript code in C++

Just like other architectures, you can use the `__asm__` keyword to write native (JavaScript) code, and pass arguments and get values back as usual.

```cpp
__asm__("alert('Hello, world!')");
```

<!-- TODO: does this work in wasm mode? -->

<!-- TODO: link to more info -->

<!--
### WebAssembly and JavaScript in the same codebase

Cheerp can compile parts of your code into JavaScript, and other parts into WebAssembly.

```cpp
// TODO
```
-->

<!-- TODO: why is this interesting / helpful? -->
