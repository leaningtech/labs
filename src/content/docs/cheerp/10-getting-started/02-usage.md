---
title: Usage
description: The basics of using Cheerp
---

Cheerp is a toolchain that includes executables like `clang` (C compiler) and `clang++` (C++ compiler) in its `bin` directory. We run these executables to compile C and C++ code to JavaScript and WebAssembly.

## Compiling C++ to JavaScript and WebAssembly

Let's say we had a `hello.cpp` file like this:

```cpp title=hello.cpp
#include <cheerp/clientlib.h>

void webMain() {
  client::console.log("Hello, world!");
}
```

We can compile this with Cheerp by running the following command:

```shell
$ /opt/cheerp/bin/clang++ hello.cpp -o hello.js -target cheerp-wasm -cheerp-make-module=es6
```

(If this command fails and outputs "file or command not found", you need to [install Cheerp](/cheerp/getting-started/installation).)

This will produce `hello.js` and `hello.wasm` files. The former is a [JavaScript module][module] that can be imported in other JavaScript code, and the latter is the WebAssembly binary which gets loaded by the JavaScript module.

## Using the output module

### Browser

To run the output module in a browser environment, you can include it as a script in an HTML file:

```html title=index.html {5}
<!doctype html>
<html>
	<head>
		<title>Hello Cheerp</title>
		<script src="hello.js" type="module" async defer></script>
	</head>
</html>
```

Then open the HTML file in a browser. You should see "Hello, world!" in the JavaScript console (usually opened with `F12`).

You can also import the output module from another module:

```js
import init from "./hello.js";

await init(); // Hello, world!
```

The default export of the module is the `init()` function. It returns a [Promise][promise] that resolves when the WebAssembly module has been loaded and its main function executed.

### Runtimes like Node.js

You can run the output module directly in any JavaScript runtime, such as Node.js, Deno, or Bun.

```sh
$ node hello.js
Hello, world!
```

Like in the browser, you can also import it in another JavaScript module:

```js
import init from "./hello.js";

await init(); // Hello, world!
```

If you are using old-style CommonJS modules, you can import it with `require`:

```js
const init = require("./hello.js");

init(); // Hello, world!
```

### Flags and options

You can pass additional flags and options to the Cheerp compiler. For example, to compile with optimizations enabled, you can pass the `-O3` flag:

```sh "-O3"
$ /opt/cheerp/bin/clang++ hello.cpp -o hello.js -target cheerp-wasm -cheerp-make-module=es6 -O3
```

[Find more information about the available flags and options](/cheerp/reference/compiler-options).

[module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
