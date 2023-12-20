---
title: cheerpjRunMain
description: Starts an application by executing the static main method of a Java class
---

```ts
async function cheerpjRunMain(
	className: string,
	classPath: string,
	...args: string[]
): Promise<number>;
```

## Parameters

- **className (`string`)** - The fully-qualified name of the class with a static main method to execute. For example, `com.application.MyClassName`.
- **classPath (`string`)** - The location of the class's jar in the [virtual filesystem], with its dependencies separated by `:`.
- **..args (`string[]`, _optional)_** - Arguments to pass to the main method.

## Returns

`cheerpjRunMain` returns a [Promise] which resolves with the [exit code] of the program. `0` indicates success, any other value indicates failure.

## Example

```js
const exitCode = await cheerpjRunMain(
	"fully.qualified.ClassName",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
	arg1,
	arg2,
);
console.log(`Program exited with code ${exitCode}`);
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[exit code]: https://en.wikipedia.org/wiki/Exit_status#Java
[virtual filesystem]: /cheerpj3/guides/File-System-support
