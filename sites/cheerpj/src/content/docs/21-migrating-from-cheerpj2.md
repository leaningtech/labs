---
title: Migration from CheerpJ 2
---

CheerpJ 3 and later are a complete reimplementation of CheerpJ 2, and are not fully backward compatible with it. This page shows how to move an application from CheerpJ 2 to the current version.

### Script tag

Replace the CheerpJ 2 loader with the current one:

```html
<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>
```

## Breaking changes

CheerpJ 3 was designed as a drop-in replacement for CheerpJ 2.3 wherever possible. A few features were removed in favour of better alternatives, listed below.

### `cheerpjInit` is now asynchronous

The runtime API is not exposed until [`cheerpjInit`] is called and its `Promise` resolves.

**`await` the [`cheerpjInit`] call** before using any other CheerpJ function.

### `cheerpj-dom.jar` removed

Java code calls JavaScript through native methods, passed with the `natives` option of `cheerpjInit`. See [implementing native methods][JNI guide].

If you used the `com.leaningtech.client` package extensively, check out the [CJDom library](https://github.com/reportmill/CJDom) (not maintained by Leaning Technologies).

### `cheerpjRunJarWithClasspath` removed

With `java -jar`, the JAR is the source of all user classes and any other class path is ignored, so this function had no use. To run a main class with a class path, use [`cheerpjRunMain`].

### `CheerpJWorker` replaced

CheerpJ loads in a Web Worker with no special setup. Call [`importScripts`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts) from the worker to load CheerpJ, then use it as usual. The `CheerpJWorker` class has been removed.

```js
importScripts("https://cjrtnc.leaningtech.com/5.0/loader.js");

// Use CheerpJ as usual
(async () => {
	await cheerpjInit();
	const lib = await cheerpjRunLibrary("/app/example.jar");
	// ...
})();
```

### `cjNew` and `cjCall` replaced with library mode API

`cjNew` and `cjCall` have been removed in favour of library mode, started with [`cheerpjRunLibrary`]. See the [library mode guide](/docs/guides/library-mode).

```js
// CheerpJ 2
cheerpjInit();
cheerpjRunJar("/app/library.jar");
let obj = await cjNew("com.library.MyClass");
await cjCall(obj, "myMethod");
```

```js
// CheerpJ 3 and later
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/library.jar");
const MyClass = await lib.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## Other changes

### No Ahead-Of-Time compilation (`cheerpjify.py`)

CheerpJ 2 needed JAR files to be post-processed ahead of time with `cheerpjify.py`, which generated a `.jar.js` file for each JAR. CheerpJ 3 and later run the original JARs: an interpreter starts running the bytecode, and a JIT compiler turns the code that runs most often into optimised JavaScript while the application runs. Without `.jar.js` files, much less data is downloaded at startup.

There is nothing to download or install:

- **AOT compilation:** delete the `.jar.js` files, and serve the original JARs.
- **`--natives`:** pass native method implementations to `cheerpjInit` with the `natives` option. See [implementing native methods][JNI guide].

### Custom class loaders

Because it compiled `.jar.js` files ahead of time, CheerpJ 2.3 supported only OpenJDK's standard class loader. CheerpJ 3 and later support custom class loaders as Java defines them.

### `com.leaningtech.handlers` HTTP handler no longer needed

CheerpJ 2 needed a Java property to be set for HTTP and HTTPS requests to work. Remove it: HTTP and HTTPS requests go through the browser's `fetch`. See [networking](/docs/guides/Networking).

### `cheerpjAddStringFile` deprecated and renamed to `cheerpOSAddStringFile`

`cheerpjAddStringFile` is renamed [`cheerpOSAddStringFile`](/docs/reference/cheerpOSAddStringFile), to match CheerpX. The old name still works, for backward compatibility.

[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
[`cheerpjRunMain`]: /docs/reference/cheerpjRunMain
[JNI guide]: /docs/guides/implementing-native-methods
