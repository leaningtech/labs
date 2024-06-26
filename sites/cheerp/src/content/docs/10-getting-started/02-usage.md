---
title: Usage
description: The basics of using Cheerp
---

Cheerp is a toolchain that includes executables like `clang` (C compiler) and `clang++` (C++ compiler) in its `bin` directory. We run these executables to compile C and C++ code to JavaScript and WebAssembly.

## Hello world

Let's build a 'Hello world' program to see the basics of using Cheerp.

```cpp title=hello.cpp
#include <cheerp/clientlib.h>

[[cheerp::genericjs]] // Required when using browser APIs like console.log
void webMain() {
  client::console.log("Hello, world!");
}
```

We can compile this with Cheerp by running the following command:

```shell
$ /opt/cheerp/bin/clang++ hello.cpp -o hello.js
```

(If this command fails and outputs "file or command not found", you need to [install Cheerp](/cheerp/getting-started/installation).)

This will produce `hello.js` and `hello.wasm` files. The JavaScript file will fetch and execute the WebAssembly file.

## Using the output

### Browser

To run the output in a browser environment, you can include it as a script in an HTML file:

```html title=index.html {5}
<!doctype html>
<html>
	<head>
		<title>Hello Cheerp</title>
		<script src="hello.js" async defer></script>
	</head>
</html>
```

Then open the HTML file in a browser from your filesystem. Notice that _this doesn't work_ - due to security reasons, `hello.js` is not allowed to fetch `hello.wasm` when the URL uses the `file://` scheme.

Instead, run an HTTP server and open the page there. For example:

```sh
$ npx http-server
```

You should see "Hello, world!" in the JavaScript console (usually opened with `F12`).

This sort of server is fine for development. In production, you will probably be using a web server like nginx, Apache, or similar, which will all work fine.

### Node.js

You can run the output directly in a runtime like Node.js:

```sh
$ node hello.js
Hello, world!
```

In CommonJS modules (i.e. not JavaScript modules), you can also `require` it from another file:

```js
require("./hello.js"); // Hello, world!
```

If you are using JavaScript modules in Node.js, or a runtime that uses them by default like Deno, [see below](#javascript-modules).

## Command-line options

### Optimisation

To optimise the output, pass a standard optimisation flag like `-O3`. Cheerp does not require the use of any post-compilation optimisation tools such as wasmopt.

### JavaScript Modules

To output [JavaScript modules][module], use [`-cheerp-make-module=es6`](/cheerp/reference/command-line-options/modules):

```shell "-cheerp-make-module=es6"
$ /opt/cheerp/bin/clang++ hello.cpp -o hello.js -cheerp-make-module=es6
```

The default export of the module is a function which returns a [Promise][promise]. The promise resolves when the WebAssembly module has been loaded and its [main function](/cheerp/reference/webMain) has been executed.

You can import it from another module like this:

```html
<script type="module">
	import init from "./hello.js";

	await init(); // Hello, world!
</script>
```

### Other options

[Find out more about the available command-line options](/cheerp/reference/command-line-options).

## Other examples

You find more examples in the [cheerp-meta repository](https://github.com/leaningtech/cheerp-meta/tree/master/examples).

[module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
