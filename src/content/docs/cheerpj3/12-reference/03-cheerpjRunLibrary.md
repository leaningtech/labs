---
title: cheerpjRunLibrary
description: Load a Java Library
---

Loads a Java library for use in JavaScript. See [library mode](/cheerpj3/guides/library-mode) for more information.

```ts
async function cheerpjRunLibrary(classPath: string): Promise<CJ3Library>;
```

## Parameters

- **classPath (`string`)** - The path to the library's jar file in the [virtual filesystem]. Pass an empty string to load the standard library only.

## Returns

`cheerpjRunLibrary` returns a [Promise] which resolves to a [CJ3Library] object.

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

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[virtual filesystem]: /cheerpj3/guides/File-System-support
[CJ3Library]: /cheerpj3/reference/CJ3Library
