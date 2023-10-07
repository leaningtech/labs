---
title: cheerpjRunMain
---

The most common way of starting an application is to use the `cheerpjRunMain` API, which lets you execute the static main method of a Java class in the classpath.

```ts
async function cheerpjRunMain(
	className: string,
	classPath: string,
	...args: string[]
): Promise<CJ3Library>;
```

## Parameters

- **className (`string`)** - The class name with the main method of your java application.
- **classPath (`string`)** - The location of the file with your class and its dependencies separated by `:`.
- **..args (`string[]`, _optional)_** - Any other arguments.

## Returns

- **`Promise\<CJ3Library>`**

## Example

```js
cheerpjRunMain(
	"fully.qualified.class.name",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
	arg1,
	arg2,
);
```
