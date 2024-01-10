---
title: Run a Java library
description: Use Java classes in JavaScript
---

## 1. Include CheerpJ on your page

```html
<script src="https://cjrtnc.leaningtech.com/3.0rc2/cj3loader.js"></script>
```

## 2. Initialize CheerpJ and load your Java library

```js
await cheerpjInit();
const cj = await cheerpjRunLibrary("/app/library.jar");
```

> [!warning]Important
> It is common for first-time users to forget to add the prefix “/app/” when passing the JAR location to cheerpJRunLibrary().

This will load `library.jar` from the root of your web server.

## 3. Call Java from JavaScript

```js
const MyClass = await cj.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## Further reading

- [`cheerpjRunLibrary` reference](/cheerpj3/reference/cheerpjRunLibrary)
