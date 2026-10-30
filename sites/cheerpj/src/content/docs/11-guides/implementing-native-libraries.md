---
title: Implementing Native Libraries
description: Java Native Interface (JNI) with CheerpJ
---

This guide explains how to use **native libraries** in CheerpJ to implement Java native methods in JavaScript.

In Java, native libraries are loaded with `System.loadLibrary`, so a Java program can call functions implemented in another language. This is part of the **Java Native Interface (JNI)**, the same interface used by the native methods described in the [`Implementing Native Methods guide`].

With the [`natives`] option, native method implementations are passed to `cheerpjInit` from the page. A native library instead keeps them in a separate JavaScript module, which the Java code loads itself and which any class in the application can use.

## Using `System.loadLibrary` for shared libraries

[`System.loadLibrary(String libname)`] loads a shared library into the application, so that Java code can call the native methods it implements. On the desktop, the Java runtime searches each path in `java.library.path` for a library file in the operating system's format (`.so`, `.dll` or `.dylib` on Linux, Windows and macOS).

Pre-built `.so`, `.dll` and `.dylib` files cannot run in the browser. In CheerpJ, the same `System.loadLibrary` call loads a `.js` file instead: a JavaScript module that implements the library's native methods. Native code can also be compiled to WebAssembly; [get in touch](https://cheerpj.com/contact/) if your application needs it.

## Steps to implement native libraries in CheerpJ

To implement a native library in CheerpJ:

1. Create a Java class that loads the library and declares the native methods.
2. Create a JavaScript module that implements the native methods.
3. Initialise CheerpJ with `java.library.path` set to the directory that contains the module.

### Loading native libraries and declaring native methods in Java

To declare a native method in Java, use the `native` keyword in the method declaration. The method is declared in the Java class but not implemented in Java. Its implementation is in the JavaScript module loaded with `System.loadLibrary`.

```java
public class ClassName {
  // Load the library file
  static {
    System.loadLibrary("<library-name>");
  }

  // Native method declaration
  private native void methodName(param1, param2, ...);
}
```

### Creating a JavaScript module and implementing the native methods

A JavaScript module is a file whose code can be exported to, and imported by, other files. The `export` keyword exposes classes, functions or other values, and `export default` sets the module's main export. CheerpJ reads the native method implementations from the object the module exports by default. For more on JavaScript modules, see the [`documentation`].

```js title="module.js"
export default {
	// JavaScript code
};
```

To implement a native method in JavaScript, add an `async` function to that object, named after the Java method: `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, the function is called `Java_com_foo_Bar_baz`.

The JavaScript function should accept the following parameters:

- A [`CJ3Library`] object `lib` as the first parameter, which gives access to the application's Java classes and methods.
- `self` as the second parameter: the Java object the native method was called on. Static native methods do not have this parameter.
- The native method's own parameters after these.

The function can return a value, or a Promise that resolves to a value. Parameters and return values are converted following the [`conversion rules`]. The syntax is:

```js
async function Java_<fully-qualified-class-name>_<method-name>(lib, self, param1, param2, ...) {
  // Implementation
}
```

> [!info] Handling static native methods
> If the native method is static, there is no `self` parameter: the method's own parameters follow `lib`.

### Initialising CheerpJ with the `javaProperties` option

Set the `java.library.path` property to the directory that contains the JavaScript module, with the [`javaProperties`] option of `cheerpjInit`:

```js
await cheerpjInit({ javaProperties: ["java.library.path=/app/<path>"] });
```

`/app/` is the [`virtual directory`] that corresponds to the root of your web server.

## Example walkthrough

This example creates a native library in JavaScript, loads it with `System.loadLibrary`, and calls one of its native methods from a Java class.

1. Start with a Java class that loads a native library and declares a native method, `alert`, that shows an alert message in the browser.

```java title="Example.java"
public class Example {
  // Load the native.js library file
  static {
    System.loadLibrary("native");
  }

  public static void main(String[] args) {
    new Example().alert("Hello, world!");
  }

  // Native method declaration
  private native void alert(String message);
}
```

2. Create a JavaScript module, `native.js`, that implements the `alert` method with a browser alert dialog. `alert` is an instance method, so the function receives `self` after `lib`.

```js title="native.js"
export default {
	async Java_Example_alert(lib, self, message) {
		window.alert(message);
	},
};
```

3. Initialise CheerpJ with the [`javaProperties`] option, setting `java.library.path` to the directory that contains `native.js`. Then run the `Example` class.

```html title="index.html" {9,10}
<!doctype html>
<html>
	<head>
		<title>Native Library Example</title>
		<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>
	</head>
	<body>
		<script type="module">
			await cheerpjInit({ javaProperties: ["java.library.path=/app/"] });
			await cheerpjRunMain("Example", "/app/");
		</script>
	</body>
</html>
```

Here `java.library.path` is `/app/`, the directory that contains the JavaScript module. The folder structure is:

```
root/
  ├── Example.class
  ├── native.js
  ├── index.html
```

When the `Example` class runs, the call to `alert` runs the `Java_Example_alert` function in `native.js`, which shows an alert dialog with the message "Hello, world!".

[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/CJ3Library#conversion-rules
[`natives`]: /docs/reference/cheerpjInit#natives
[`System.loadLibrary(String libname)`]: https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#loadLibrary-java.lang.String-
[`native methods`]: /docs/guides/implementing-native-methods
[`Implementing Native Methods guide`]: /docs/guides/implementing-native-methods
[`virtual directory`]: /docs/explanation/File-System-support
[`javaProperties`]: /docs/reference/cheerpjInit#javaproperties
[`documentation`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
