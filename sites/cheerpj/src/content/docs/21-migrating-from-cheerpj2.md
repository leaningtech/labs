---
title: Migration from CheerpJ 2
---

CheerpJ 3 is a complete reimplementation of CheerpJ 2, and as such it is not fully backwards compatible.

## Script tag

Include CheerpJ 3 on your page with the following snippet:

```html
<script src="https://cjrtnc.leaningtech.com/3.0/cj3loader.js"></script>
```

## Breaking changes

When designing the new architecture we had the objective of making a drop-in replacement for CheerpJ 2.3 as much as we could. This objective has been _mostly_ achieved, but in some cases we had to deprecate and remove functionalities in favor of much improved alternatives.

### `cheerpjInit` is now asynchronous

The runtime API is not exposed until [`cheerpjInit`] is called and its `Promise` resolves.

Therefore, **be sure to `await` the [`cheerpjInit`] call** before using any other functions.

### `cheerpj-dom.jar` removed

Calling JavaScript functions from Java is now done using the `natives` option of `cheerpjInit`. See the [JNI guide] for more information.

If you used the `com.leaningtech.client` package extensively, check out the [CJDom library](https://github.com/reportmill/CJDom) (not maintained by Leaning Technologies).

### `cheerpjRunJarWithClasspath` removed

This feature had no real use case because when using `java -jar`, the JAR file is the source of all user classes, and any other class path settings are ignored.

### `CheerpJWorker` replaced

CheerpJ can now be imported in a Web Worker without any special setup. Simply call [`importScripts`](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts) from a worker to load CheerpJ, then use CheerpJ as usual. The `CheerpJWorker` class has been removed.

```js
importScripts("https://cjrtnc.leaningtech.com/3.0/cj3loader.js");

// Use CheerpJ as usual
(async () => {
  await cheerpjInit();
  const lib = await cheerpjRunLibrary("/app/example.jar");
  // ...
)();
```

### `cjNew` and `cjCall` replaced with library mode API

`cjNew` and `cjCall` have been removed in favour of [`cheerpjRunLibrary`].

```js
// CheerpJ 2
cheerpjInit();
cheerpjRunJar("/app/library.jar");
let obj = await cjNew("com.library.MyClass");
await cjCall(obj, "myMethod");
```

```js
// CheerpJ 3
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/library.jar");
const MyClass = await lib.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## Other major changes

<!-- TODO: copy from cheerpj-3-deep-dive blog post -->

### No Ahead-Of-Time compilation (`cheerpjify.py`)

**No Ahead-Of-Time compilation:** To achieve good performance, CheerpJ required you to post-process JAR files with a custom binary compiler. The compiler would generate a `.jar.js` files for each input JAR. CheerpJ 3 features an advanced JIT engine that can generate better-performing code than CheerpJ 2.3 ever could. Removal of `.jar.js` files also significantly decreases how much data needs to be downloaded during application startup.

No downloads are provided with CheerpJ 3.

- AOT optimization: CheerpJ 3 uses a JIT compiler only, and as such it does not require any pre-processing of the JAR files, like conversion to `.jar.js`.
- `--natives`: JNI function implementations should be passed to `cheerpjInit` using the `natives` option. See the [JNI guide] for more information.

### Actual support for ClassLoaders

CheerpJ 2.3 had very limited support for ClassLoaders. As a consequence of requiring AOT compilation of `.jar.js` files, it could only support the standard one provided by OpenJDK. CheerpJ 3.0 radically improves the status-quo by properly using ClassLoaders as expected by Java.

### `com.leaningtech.handlers` HTTP handler no longer needed

Previously, CheerpJ 2 required a special Java property to be set in order for HTTP(S) requests to work. This is no longer needed.

### `cheerpjAddStringFile` deprecated and renamed to `cheerpOSAddStringFile`

The `cheerpjAddStringFile` function has been renamed to `cheerpOSAddStringFile` to better reflect its behaviour and provide parity with CheerpX. The old name is still available for backwards compatibility.

[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
[`cheerpjRunMain`]: /docs/reference/cheerpjRunMain
[JNI guide]: /docs/guides/Implementing-Java-native-methods-in-JavaScript
