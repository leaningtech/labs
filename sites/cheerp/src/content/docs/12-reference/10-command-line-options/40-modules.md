---
title: Modules
description: Create JavaScript modules or CommonJS with `-cheerp-make-module`
# TODO: could do with some cleaning up
---

## JavaScript modules

Use the `-cheerp-make-module=es6` flag to generate a [JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules):

```bash "-cheerp-make-module=es6"
/opt/cheerp/bin/clang++ code.cpp -o module.js -cheerp-make-module=es6
```

### Using modules

#### In HTML

```html 'type="module"'
<script type="module" src="module.js"></script>
```

#### In another JavaScript module

```javascript
import init from "./module.js";

const module = await init();
console.log("Module has been instantiated!");
module.someJSExportedFunc();
```

There are a couple of important things to notice:

- Cheerp modules provide an initialization function as default export, in the import directive you can name it whatever you want
- This function once called will return a Promise that will resolve when the module has been instantiated, and will return an object with the JSExported function and classes as properties
- The instantiation function has to be called only once. Any additional call is Undefined Behaviour (in the current implementation it would perform initialization of C++ state twice, so the logic integrity of the program will be compromised, but do not rely on any specific behaviour since it might change in future versions).

## Why use JavaScript modules?

In regular JavaScript a script has no knowledge of its own location, so all information about location of a file are relative to the root of the server.
This means that for regular Cheerp compilation you will have to know where a file is located in advance (and provide this information at compile time via `-cheerp-secondary-output-file=...` and `-cheerp-secondary-output-path=...`).
Modules offer a more manageable solution: the default will be having the WebAssembly file in the same folder of the JavaScript one, compilation arguments will overwrite this, and advanced options allows even to provide at runtime the location or content of the WebAssembly file.

## What should I know about JavaScript modules?

- modules code is executed in a separate realm/scope, meaning that the global namespace will not be polluted
- export directives allow module to expose JavaScript function, object or classes as an interface
- import directives allow external code to access the expored functions
- modules can be imported only by other modules
- modules initialization code is only ever executed once (even if imported multiple times)
  For plenty of background and technical information around ES6 modules we reccomend [MDN's guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) of [V8's guide on JavaScript modules](https://v8.dev/features/modules).

## The initialisation function

- Module instantiating function has to be called exactly once
- The module instantiating function takes either no arguments (so default are used) or an object with options to be passed to the instantiating logic. Currently supported parameters are:
  - `absPath` - the absolute Path of the secondary file (in the common case, the Wasm file) from the root of the page
  - `buffer` - a buffer containing the content of the secondary file (in the common case, the Wasm file)
- The module instantiating function returns a Promise that will resolve to an object (possibly empty) wrapping the `[[cheerp::jsexport]]`-ed functions or classes.
- Both static or dynamic imports are supported

These instantiation are all somehow equivalent:

- instantiation with no arguments

```js
import instantiateFunction from "./yourModule.js";
instantiateFunction().then((module) => {
	console.log("Module has been instantiated!");
	module.someJSExportedFunc();
});
```

- instantiation with no absolute path

```js
import instantiateFunction from "./yourModule.js";
instantiateFunction({ absPath: "/absolute/path/to/yourModule.wasm" }).then(
	(module) => {
		console.log("Module has been instantiated!");
		module.someJSExportedFunc();
	},
);
```

- instantiation with buffer

```js
import instantiateFunction from './yourModule.js'
fetch('/absolute/path/to/yourModule.wasm').then(buffer => {
	instantiateFunction({buffer:buffer}).then(module =>
		{
			console.log("Module has been instantiated!");
			module.someJSExportedFunc();
		}
	});
```

- instantiation with path relative to current module

```js
import instantiateFunction from "./yourModule.js";
instantiateFunction({
	absPath: new URL("/relative/path/to/yourModule.wasm", import.meta.url),
}).then((module) => {
	console.log("Module has been instantiated!");
	module.someJSExportedFunc();
});
```

- dynamic instantiation with no arguments

```js
import("./yourModule.js")
	.then((instantiateFunction) => instantiateFunction())
	.then((module) => {
		console.log("Module has been instantiated!");
		module.someJSExportedFunc();
	});
```

## ES6 modules and top-level await

```js
import instantiateFunction from './someFile.js'

var module = await instantiateFunction();
console.log("Module has been instantiated!");

export module;		// or destructuring the different exports
```

## CommonJS

Cheerp supports the CommonJS standard for JavaScript modules via the `-cheerp-make-module=commonjs` option.
With this option an `exports` object will be automatically populated with all the exported functions.
This allows JavaScript code from other files to use `require()` and import them.

The actual object returned by `require()` is a `Promise`, since the code produced by Cheerp may contain WebAssembly (which is only loaded and compiled asynchronously).

For example, suppose that you have a project in which you need to sort a big array, and you want to replace the slow `Array.sort()` with a faster version. Instead of writing your own sorting function, you can use `std::sort()` from the C++ STL:

```cpp
#include <cheerp/client.h>
#include <algorithm>

[[cheerp::jsexport]]
extern "C" void sort(client::Int32Array* a)
{
	int* begin = &(*a)[0];
	int* end = begin + (int)a->get_length();
	std::sort(begin, end);
}
```

You can compile the above code with `/opt/cheerp/bin/clang++ -target cheerp sort.cpp -o sort.js -cheerp-make-module=commonjs` and put the resulting `sort.js` in your project source folder.
Than, using it is as easy as:

```js
let cheerplib = require("./sort");
cheerplib.then((cl) => {
	let arr = new Int32Array([4, 2, 3, 1]);
	cl.sort(arr);
	console.log("Sorted with std::sort: " + arr);
});
```

This option is useful to those who wish to use code compiled with Cheerp from Node.js, but it also allows Cheerp code to be used with JavaScript bundlers such as [Webpack](https://webpack.js.org/).
