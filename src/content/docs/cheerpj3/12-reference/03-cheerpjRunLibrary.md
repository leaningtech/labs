---
title: cheerpjRunLibrary
description: Load a Java Library
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

`CJ3Library` instances can be used to access the classes and methods of the loaded library through property access:

- To load a class, access it and await it.
- To call a static method, call it as a method on a loaded class and await it.
- To construct a class into an instance, use `await new`.
- To call an instance method, call it as a method on an instance of a loaded class and await it.
- To read/write a public field, do so normally.
- `instanceof` is supported.

#### Conversion rules

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

## Examples

### Using the standard library

```js
await cheerpjInit();
const lib = await cheerpjRunLibrary("");

const System = await lib.java.lang.System;
await System.out.println("Hello from Java");
```

### Using a custom library

Let's say we had a library called `example.jar` compiled from the following class:

```java
package com.example;

public class Example {
  public String[] greetings = {"Hello", "Bye"};
  public void hello() {
    System.out.println("Example says hello!");
  }
}
```

With `example.jar` being available on the web server at `/example.jar`, we could use it like so:

```js
await cheerpjInit();
const lib = await cheerpjRunLibrary("/app/example.jar");

const Example = await lib.com.example.Example;
const example = await new Example();
await example.hello(); // Example says hello!
```

### Access to object property/attribute

From the example above:

```js
const greetingsArray = example["greetings"];
```

or

```js
const greetingsArray = example.greetings;
```

### Exception handling

```js
await cheerpjInit();
const lib = await cheerpjRunLibrary("");

try {
	// Attempt to load a class that doesn't exist
	await lib.java.lang.DoesntExist;
} catch (e) {
	await e.printStackTrace(); // java.lang.ClassNotFoundException: java.lang.DoesntExist
}
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[virtual filesystem]: /cheerpj3/guides/File-System-support
