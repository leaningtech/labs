---
title: CJ3Library
description: A library mode session
---

This class represents a [library mode](/docs/guides/library-mode) session. It can be used to access the classes and methods of the loaded library.

You can get a CJ3Library instance by:

- Calling [`cheerpjRunLibrary`] to load a library from a JAR.
- Implementing a [native method](/docs/guides/Implementing-Java-native-methods-in-JavaScript) - the first parameter is a CJ3Library instance.

## Usage

- To load a class, access it and await it.
- To call a static method, call it as a method on a loaded class and await it.
- To construct a class into an instance, use `await new`.
- To call an instance method, call it as a method on an instance of a loaded class and await it.
- To read/write a public field, do so normally.
- `instanceof` is supported.

## Conversion rules

Type conversions adhere to the [LiveConnect specification](https://web.archive.org/web/20110204185537/http://jdk6.java.net/plugin2/liveconnect/#JS_JAVA_CONVERSIONS). There are some extensions:

| JavaScript type | Java type                      | Note             |
| --------------- | ------------------------------ | ---------------- |
| `Uint8Array`    | `boolean[]`                    | By reference     |
| `Int8Array`     | `byte[]`                       | By reference     |
| `Uint16Array`   | `char[]`                       | By reference     |
| `Int16Array`    | `short[]`                      | By reference     |
| `Int32Array`    | `int[]`                        | By reference     |
| `BigInt64Array` | `long[]`                       | By reference     |
| `Float32Array`  | `float[]`                      | By reference     |
| `Float64Array`  | `double[]`                     | By reference     |
| `any`           | `netscape.javascript.JSObject` | Opaque reference |

For other types, refer to the LiveConnect specification.

## `CJ3Library#getJNIDataView`

```ts
class CJ3Library {
	getJNIDataView(): DataView;
}
```

Returns a `DataView` of the library's raw JNI memory.

[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
