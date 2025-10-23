---
title: Run a Java library
description: Use Java classes in JavaScript
---

CheerpJ can load and run Java libraries directly in the browser, allowing you to call Java classes and methods from JavaScript with no modifications to your original code. This page will help you get started with CheerpJ and show you how to use an existing Java library (`.jar` file) within a web application.

Java source code is not required to use CheerpJ. If you are using your own library, you should already have its compiled `.jar` file available.

## 1. Include CheerpJ on your page

```html
<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
```

## 2. Initialize CheerpJ and load your Java library

```js
await cheerpjInit();
const cj = await cheerpjRunLibrary("/app/library.jar");
```

> [!help] Don't forget to use the /app/ prefix
> It is common for first-time users to forget to add the prefix “/app/” when passing the JAR location to cheerpJRunLibrary().

This will load `library.jar` from the root of your web server.

## 3. Call Java from JavaScript

```js
const MyClass = await cj.com.library.MyClass;
const obj = await new MyClass();
await obj.myMethod();
```

## Further reading

- [Learn more about Library Mode](/docs/guides/library-mode)
- [`cheerpjRunLibrary` reference](/docs/reference/cheerpjRunLibrary)
