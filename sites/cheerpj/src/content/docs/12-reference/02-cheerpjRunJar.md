---
title: cheerpjRunJar
description: Execute the main class of a JAR
---

```ts
async function cheerpjRunJar(
	jarName: string,
	...args: string[]
): Promise<number>;
```

## Parameters

- **jarName (`string`)** - The location of the jar in the [virtual filesystem].
- **..args (`string[]`, _optional_)** - Arguments to pass to the main method.

## Returns

`cheerpjRunJar` returns a [Promise] which resolves with the [exit code] of the program. `0` indicates success, any other value indicates failure.

## Examples

### Basic usage

```js
const exitCode = await cheerpjRunJar("/app/application.jar");
console.log(`Program exited with code ${exitCode}`);
```

### Command line arguments

```js
await cheerpjRunJar("/app/application.jar", --version");
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[exit code]: https://en.wikipedia.org/wiki/Exit_status#Java
[virtual filesystem]: /docs/guides/File-System-support
