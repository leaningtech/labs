---
title: cheerpjRunLibrary
---

Allows to load a Java Library into JavaScript.

```ts
async function cheerpjRunLibrary(classPath: string): Promise<CJ3Library>;
```

## Parameters

- **classPath (`string`)** - The path to the library's jar file in the [virtual filesystem]. Pass an empty string to load the standard library only.

## Returns

`cheerpjRunLibrary` returns a [Promise] which resolves to a `CJ3Library` object.

### CJ3Library

This object can be used to access the classes and methods of the loaded library through property access.

- To load a class, access it and await it.
- To call a static method, call it as a method on a loaded class and await it.
- To construct a class into an instance, use `await new`.
- To call an instance method, call it as a method on an instance of a loaded class and await it.

Parameters and return values of method calls are automatically converted between JavaScript and Java types.

> [!warning] Warning
> Array interop is not yet supported.

## Example

```js
await cheerpjInit();
const cj = await cheerpjRunLibrary("/app/library.jar");
const MyClass = await cj.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[virtual filesystem]: /cheerpj3/guides/File-System-support
