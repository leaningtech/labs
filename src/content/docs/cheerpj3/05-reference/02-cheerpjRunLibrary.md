---
title: cheerpjRunLibrary
---

Allows to load a Java Library into JavaScript.

```ts
async function cheerpjRunLibrary(classPath: string): Promise<CJ3Library>;
```

## Parameters

- **classPath (`string`)** - The path of your Java library file

## Returns

- **`Promise<CJ3Library>`**

## Example

```js
await cheerpjInit();
const cj = await cheerpjRunLibrary("/app/library.jar");
const MyClass = await cj.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```
