---
title: Migration from CheerpJ 2
---

CheerpJ 3 is a complete reimplementation of CheerpJ 2, and as such it is not fully backwards compatible. This page lists the API differences between the two versions.

## `cheerpjify.py` removed

No downloads are provided with CheerpJ 3.

- AOT optimization: CheerpJ 3 uses a JIT compiler only, and as such it does not require any pre-processing of the jar files, like conversion to `.jar.js`.
- `--natives`: JNI function implementations should be passed to `cheerpjInit` using the `natives` option. See the [JNI guide] for more information.

## `cheerpjInit`

The runtime API is not exposed until `cheerpjInit` is called and its `Promise` resolves.

Therefore, be sure to `await` the `cheerpjInit` call before using any other functions.

## `cheerpjRunJarWithClasspath` removed

Use [`cheerpjRunMain`] instead.

## `cjNew` and `cjCall` replaced with CJ3Library API

`cjNew` and `cjCall` have been removed in favour of [`cheerpjRunLibrary`].

```js
// CheerpJ 2
cheerpjInit();
cheerpjRunJar("/app/library.jar");
let obj = await cjNew("com.library.MyClass");
await cjCall(obj, "myMethod");

// CheerpJ 3
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/library.jar");
const MyClass = await lib.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## `com.leaningtech.handlers` HTTP handler no longer needed

Previously, CheerpJ 2 required a special Java property to be set in order for HTTP(S) requests to work. This is no longer needed.
.

## `cheerpj-dom.jar` removed

Calling JavaScript functions from Java is now done using the `natives` option of `cheerpjInit`. See the [JNI guide] for more information.

If you used the `com.leaningtech.client` package extensively, check out the [CJDom library](https://github.com/reportmill/CJDom) (not maintained by Leaning Technologies).

## APIs not yet implemented

- `cheerpjRunJarWithClasspath`
- `CheerpJWorker`

[`cheerpjRunLibrary`]: /cheerpj3/reference/cheerpjRunLibrary
[`cheerpjRunMain`]: /cheerpj3/reference/cheerpjRunMain
[JNI guide]: /cheerpj3/guides/Implementing-Java-native-methods-in-JavaScript
