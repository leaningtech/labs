---
title: Implementing Native Methods
description: Java Native Interface (JNI) with CheerpJ
---

CheerpJ allows one to implement Java native methods (typically written in C/C++ or another AOT-compiled language) directly in JavaScript, similar to the Java Native Interface (JNI) in standard Java.

In Java, native methods are identified by the `native` keyword in their declaration. These methods are not implemented in Java but are instead defined in an external language, which in the case of CheerpJ, is JavaScript.

## Overview

In general, we can implement native methods in CheerpJ by following these steps:

1. Declare a native method in Java using the `native` keyword.
2. Implement the native method in JavaScript.
3. Pass the native function to CheerpJ.

## Declaring Native Methods in Java

To declare a native method in Java, use the `native` keyword in the method declaration. Here’s an example of a Java class with a native method:

```java title="Example.java"
public class Example {
  public static void main(String[] args) {
    nativeAlert("Hello, world!");
  }

  public static native void nativeAlert(String message);
}
```

The method is defined in the Java class but is not implemented in Java. Instead, the implementation will be provided in JavaScript.

## Implementing Native Methods in JavaScript

To implement a native method in JavaScript, create an `async` function that follows the naming convention `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, its object key is `Java_com_foo_Bar_baz`. The function takes:

- A [`CJ3Library`] object `lib` as the first parameter, which provides access to other classes and methods within the library. The `lib` parameter can be used to call back into the Java class that calls the native method.
- `self` as the second parameter, the instance of the Java class calling the native method. This parameter can be omitted for static native methods.
- The native method’s parameters as subsequent parameters.

And returns a value or a Promise that resolves to a value. The function syntax is as follows:

```js
async function Java_<fully-qualified-class-name>_<method-name>(lib, self, param1, param2, ...) {
  // Implementation
}
```

> [!info] Handling Static Native Methods
> If the native method is static, the `self` parameter can be omitted.

## Calling back into Java from JavaScript

It is possible to call back into Java using the `lib` parameter received in the JavaScript implementation of the native Java method.

Let’s take this simple Java class as an example:

```java title="Example.java"
public class Example {
  public static native void nativeFunction();

  public static void printJava() {
    System.out.println("Hello from Java!");
  }

  public static void main(String[] args) {
    nativeFunction();
  }
}
```

The `Example` class includes a `native` function that will be implemented in JavaScript, and a public print function that outputs `Hello from Java!`.
In the JavaScript implementation of `nativeFunction`, we can use the `lib` parameter to call back into the `Example` Java class and invoke the `printJava()` function from JavaScript.

```js
async function Java_Example_nativeFunction(lib) {
	const Example = await lib.Example;
	await Example.printJava();
}
```

This functionality is useful when you need to call back into the Java class in response to a native function call. If you need to call back into Java outside the context of a native function, you can use a long-running Java thread. You can learn more about how to achieve this in our [`Java and JavaScript Interoperability`] tutorial.

## Passing Native Functions to CheerpJ

To use the native method in CheerpJ, pass the function to the [`cheerpjInit`] function as a property of the [`natives`] option. You can pass:

1. **The function definition directly**:

```js
await cheerpjInit({
	natives: {
		async Java_Example_nativeAlert(lib, str) {
			window.alert(str);
		},
	},
});
```

2. **Or just the function name if it was defined earlier**:

```js
async function Java_Example_nativeAlert(lib, str) {
	window.alert(str);
}

await cheerpjInit({ natives: { Java_Example_nativeAlert } });
```

## Converting Parameters and Return Values

Parameters and return values of JNI calls are automatically converted between JavaScript and Java types based on [`conversion rules`].

## Example Walkthrough

Here’s a full example that demonstrates the native method setup in Java and its JavaScript implementation.

1. Declare a native method in Java using the `native` keyword:

```java title="Example.java"
public class Example {
  public static void main(String[] args) {
    nativeAlert("Hello, world!");
  }

  public static native void nativeAlert(String message);
}
```

2. Implement the native method by creating an `async` function in JavaScript that follows the naming convention `Java_<fully-qualified-class-name>_<method-name>`.

```js title="index.html"
async function Java_Example_nativeAlert(lib, str) {
	window.alert(str);
}
```

Here, we provide an implementation for the `nativeAlert` method in the `Example` class, by creating a function named `Java_Example_nativeAlert`. The function displays an alert dialog with the message using `window.alert`.

3. Initialize CheerpJ with the `natives` option and pass the native method implementation to [`cheerpjInit`]:

```html title="index.html" {13}
<!doctype html>
<html>
	<head>
		<title>Native Method Example</title>
		<script src="https://cjrtnc.leaningtech.com/4.1/loader.js"></script>
	</head>
	<body>
		<script>
			async function Java_Example_nativeAlert(lib, str) {
			  window.alert(str);
			}

			await cheerpjInit({ natives: { Java_Example_nativeAlert } });
			await cheerpjRunMain("Example", "/app/");
		</script>
	</body>
</html>
```

In this setup, [`cheerpjInit`] loads `Java_Example_nativeAlert` as the native method implementation. When `Example.nativeAlert` is called in Java, it triggers the JavaScript `Java_Example_nativeAlert` function, displaying an alert dialog with the message.

[`natives`]: /docs/reference/cheerpjInit#natives
[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/CJ3Library#conversion-rules
[`cheerpjInit`]: /docs/reference/cheerpjInit
[`Java and JavaScript Interoperability`]: /docs/tutorials/interoperability-tutorial
