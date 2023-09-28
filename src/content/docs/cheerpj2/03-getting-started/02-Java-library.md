---
title: Run a Java library
subtitle: Use Java classes in JavaScript
---

## 1. Include CheerpJ on your page

```html
<script src="https://cjrtnc.leaningtech.com/2.3/loader.js"></script>
```

## 2. Initialize CheerpJ and load your Java library

```js
cheerpjInit();
cheerpjRunJar("/app/library.jar");
```

This will load `library.jar` from the root of your web server.

## 3. Call Java from JavaScript

```js
let obj = await cjNew("com.library.MyClass");
await cjCall(obj, "myMethod");
```

## Further reading

- [API reference](/cheerpj2/reference/Runtime-API#calling-java-from-js)
- [AOT optimization](/cheerpj2/guides/AOT-optimization)
