---
title: Java API
---

An additional jar (`cheerpj-dom.jar`) in the CheerpJ [downloadable archive](<(https://leaningtech.com/download-cheerpj/)>) has been provided to allow interactions with the browser DOM directly from Java.

This JAR provides declarations for all of the relevant Java interfaces and classes. In particular you will find them wrapped in the `com.leaningtech.client` package, for example the `Document` interface of the browser (documented [here](https://developer.mozilla.org/en-US/docs/Web/API/Document)) becomes `com.leaningtech.client.Document` with CheerpJ.

The `com.leaningtech.client.Global` is a representation of the global namespace in the browser context. It only contains static methods and fields.

Usage examples can be found at [DOM and JavaScript interoperability](/cheerpj2/guides/DOM-and-JavaScript-interoperability).

## Global.JSString

Converts a Java String to a JSString.

```java
JSString myjsstring = Global.JSString("Hi!");
```

## Global.JavaString

Converts a JSString to a Java String.

```java
String mystring = Global.JavaString("Hello!");
```

## Global.jsCall / jsCallI / jsCallD / jsCallS

Calls an arbitrary JavaScript function.
| Method | Parameters | Output |
| ------ | ------------------------------------ | ------ |
| jsCall | String funcName, Object... arg | Object |
| jsCallI | String funcName, Object... arg | Int |
| jsCallD | String funcName, Object... arg | Double |
| jsCallS | String funcName, Object... arg | JSString |

## Further reading

- [DOM and JavaScript interoperability](/cheerpj2/guides/DOM-and-JavaScript-interoperability)
