---
title: Implementing native methods and libraries
description: Java Native Interface (JNI) with CheerpJ
---

With CheerpJ, it is possible to implement Java 'native' methods (that would normally be implemented in C/C++ or other AOT-compiled language) in JavaScript, similarly to what would be done in regular Java using the Java Native Interface (JNI).

You can recognise these methods in Java code by the `native` keyword in their declaration. These functions are not implemented in Java, but are instead implemented in JavaScript.

## Using the `natives` option of `cheerpjInit`

`cheerpjInit` accepts a `natives` object that can be used to provide implementations of native methods. The object's keys are the names of the native methods, and the values are the implementations:

- **Key:** string in the form `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, its object key is `Java_com_foo_Bar_baz`.
- **Value:** async function that takes a [`CJ3Library`] object as its first parameter, followed by the method's parameters. The function can return a value or a Promise that resolves to a value.

Parameters and return values are subject to [conversion rules].

### Example

Consider the following Java class:

```java title="Example.java"
public class Example {
	public static void main(String[] args) {
    alert("Hello, world!");
	}

  public static native void alert(String message);
}
```

To provide an implementation of `alert`, pass it to the `cheerpjInit` function as a property of the `natives` object:

```js
await cheerpjInit({
	natives: {
		async Java_Example_alert(lib, str) {
			window.alert(str);
		},
	},
});
await cheerpjRunMain("Example", "/app/");
```

The `lib` parameter is a [CJ3Library]. It can be used to access other classes and methods of the library.

Parameters and return values of JNI calls are automatically converted between JavaScript and Java types.

## Using `System.loadLibrary` for shared/dynamic libraries

[`System.loadLibrary(String libname)`] is a Java method that loads a native library (`.so`, `.dll`, or `.dylib` file) and makes its methods available to Java code. The library is found by searching each path in `java.library.path` for a file called `libname.so` (or `libname.dll` or `libname.dylib` on Windows and macOS, respectively).

CheerpJ behaves the same way, but looks for files called `libname.js`. This file should be a module that exports an object with the same structure as the `natives` object described above.

### Example

```java title={Example.java}
public class Example {
  static {
    System.loadLibrary("native");
  }

  public static void main(String[] args) {
    new Example().alert("Hello, world!");
  }

  private native void alert(String message);
}
```

```js title={native.js}
export default {
	async Java_Example_alert(lib, self, message) {
		window.alert(message);
	},
};
```

```js
await cheerpjInit({ javaProperties: ["java.library.path=/app/"] });
await cheerpjRunMain("Example", "/app/");
```

[`CJ3Library`]: /cheerpj3/reference/cheerpjRunLibrary#cj3library
[conversion rules]: /cheerpj3/reference/cheerpjRunLibrary#conversion-rules
[`System.loadLibrary(String libname)`]: https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#loadLibrary-java.lang.String-
