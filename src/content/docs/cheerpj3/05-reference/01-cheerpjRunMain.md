---
title: cheerpjRunMain
---

The most common way of starting an application is to use the `cheerpjRunMain` API, which lets you execute the static main method of a Java class in the classpath.

| **Parameters** | **Type**          |
| -------------- | ----------------- |
| className      | string            |
| classPath      | string            |
| ...args        | string[]          |
| **Returns**    | Promise\<unknown> |

Example:

```js
cheerpjRunMain(
	"fully.qualified.class.name",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
	arg1,
	arg2,
);
```
