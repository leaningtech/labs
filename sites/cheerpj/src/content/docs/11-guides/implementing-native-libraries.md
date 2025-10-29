---
title: Implementing Native Libraries
description: Java Native Interface (JNI) with CheerpJ
---

In this guide, we’ll explore how to use **native libraries** in CheerpJ to implement Java native methods in JavaScript.

Native libraries in Java are typically loaded with the `System.loadLibrary` method allowing a Java program to call functions implemented in another language. This function is part of the **Java Native Interface (JNI)**, the same interface used to work with Java native methods, which we covered in the [`Implementing Native Methods guide`].

Unlike [`native methods`], native libraries are not restricted to a single Java class. They can be accessed by multiple classes and even be shared across an entire application.

## Using `System.loadLibrary` for shared libraries

[`System.loadLibrary(String libname)`] is a Java method that loads a shared library into the application, making the native methods within the library accessible to Java code. The Java runtime searches each path in `java.library.path` for the library file with the correct format for the operating system (`.so`, `.dll`, or `.dylib` on Linux, Windows, and macOS, respectively).

CheerpJ adapts this concept to load JavaScript modules, using the same `System.loadLibrary` call to load `.js` files. These files are JavaScript modules that define implementations for the native methods associated with the library.

## Steps to implement native libraries in CheerpJ

In general, we can implement native libraries in CheerpJ by following these steps:

1. Create a Java class that loads the JavaScript library and declares the native methods.
2. Create a JavaScript module that implements the native methods.
3. Load the native library in the Java class with CheerpJ.

### Loading native libraries and declaring native methods in Java

To declare a native method in Java, use the `native` keyword in the method declaration. The method is defined in the Java class but is not implemented in Java. Instead, the implementation will be provided in the native library JavaScript module which is loaded with `System.loadLibrary`.

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

A JavaScript module is a file that contains code which can be exported and imported by other files for better organization and reuse. You create modules using the `export` keyword to expose classes, methods, or other resources, and you can use `export default` to make a primary, easy-to-import item from the module. For more information on JavaScript modules, check out the official [`documentation`].

```js title="module.js"
export default {
	// JavaScript code
};
```

To implement a native method in JavaScript, create an `async` function that follows the naming convention `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, the function will be called `Java_com_foo_Bar_baz`.

The JavaScript function should accept the following parameters:

- A [`CJ3Library`] object `lib` as the first parameter, which provides access to other classes and methods within the library.
- `self` as the second parameter, the instance of the Java class calling the native method. This parameter can be omitted for static native methods.
- The native method’s parameters as subsequent parameters.

The function can return a value or a Promise that resolves to a value. The function syntax is as follows:

```js
async function Java_<fully-qualified-class-name>_<method-name>(lib, self, param1, param2, ...) {
  // Implementation
}
```

> [!info] Handling Static Native Methods
> If the native method is static, the `self` parameter can be omitted.

### Initializing CheerpJ with the `javaProperties` option

To use a native library in CheerpJ, you need to set the `java.library.path` property to the directory containing the JavaScript module file that implements the native methods. This is done by passing the `javaProperties` option to the `cheerpjInit` function:

```js
await cheerpjInit({ javaProperties: ["java.library.path=/app/<path>"] });
```

`/app/` is a [`virtual directory`] in CheerpJ that corresponds to the root directory of the application.

## Example walkthrough

In the following example, we’ll see how to create a native library in JavaScript, load it into Java with `System.loadLibrary`, and call a native method through this library from a Java class.

1. Let's start with a Java class that loads a native library and declares a native method, `alert`, that displays an alert message in the browser.

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

2. Next, we create a JavaScript module, `native.js`, that implements the `alert` method to display an alert dialog in the browser.

```js title="native.js"
export default {
	async Java_Example_alert(lib, message) {
		window.alert(message);
	},
};
```

3. Finally, we initialize CheerpJ with the [`javaProperties`] option to set the `java.library.path` to the directory containing the `native.js` file. Then, we run the Java `Example` class.

```html title="index.html" {9,10}
<!doctype html>
<html>
	<head>
		<title>Native Method Example</title>
		<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
	</head>
	<body>
		<script>
			await cheerpjInit({ javaProperties: ["java.library.path=/app/"] });
			await cheerpjRunMain("Example", "/app/");
		</script>
	</body>
</html>
```

In this example, we set the `java.library.path` to `/app/`, which is the directory where the JavaScript file implementing the native methods is located. The folder structure should look like this:

```
root/
  ├── Example.class
  ├── native.js
  ├── index.html
```

When the Java `Example` class is run, the `alert` method is called, which triggers the `Java_Example_alert` function in `native.js`, displaying an alert dialog with the message "Hello, world!".

[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/cheerpjRunLibrary#conversion-rules
[`System.loadLibrary(String libname)`]: https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#loadLibrary-java.lang.String-
[`native methods`]: /docs/guides/implementing-native-methods
[`Implementing Native Methods guide`]: /docs/guides/implementing-native-methods
[`virtual directory`]: /docs/guides/File-System-support
[`javaProperties`]: /docs/reference/cheerpjInit#javaproperties
[`documentation`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
