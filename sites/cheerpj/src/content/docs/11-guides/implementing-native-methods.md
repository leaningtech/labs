---
title: Implementing Native Methods
description: Java Native Interface (JNI) with CheerpJ
---

In this guide, we’ll explore how to use **native methods** in CheerpJ to implement Java native methods in JavaScript.

CheerpJ allows one to implement Java native methods (typically written in C/C++ or another AOT-compiled language) directly in JavaScript, similar to the Java Native Interface (JNI) in standard Java.

In Java, native methods are identified by the `native` keyword in their declaration. These methods are not implemented in Java but are instead defined in an external language, which in the case of CheerpJ, is JavaScript.

## Steps to implement native methods in CheerpJ

In general, we can implement native methods in CheerpJ by following these steps:

1. Declare a native method in Java using the `native` keyword.
2. Implement the native method in JavaScript.
3. Pass the native function to CheerpJ.

### Declaring Native Methods in Java

To declare a native method in Java, use the `native` keyword in the method declaration. The method is defined in the Java class but is not implemented in Java. Instead, the implementation will be provided in JavaScript.

```java
public class ClassName {
  // Native method declaration
  private native void methodName(param1, param2, ...);
}
```

### Implementing Native Methods in JavaScript

To implement a native method in JavaScript, create an `async` function that follows the naming convention `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, its object key is `Java_com_foo_Bar_baz`.

The JavaScript function should accept the following parameters:

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

### Initializing CheerpJ with the `natives` option

To use the native method in CheerpJ, pass the function to the [`cheerpjInit`] function as a property of the [`natives`] option. There are two ways in which you can do this.

1. **In the function definition directly**

```js
await cheerpjInit({
	natives: {
		async Java_Example_nativeMethodName(lib, str) {
			// Implementation
		},
	},
});
```

2. **Or just the function name if it was defined earlier**

```js
async function Java_Example_nativeMethodName(lib, str) {
	// Implementation
}

await cheerpjInit({ natives: { Java_Example_nativeMethodName } });
```

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
		<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
	</head>
	<body>
		<script type="module">
			async function Java_Example_Alert(lib, str) {
				window.alert(str);
			}
			// Init CheerpJ and register natives, then run your main
			await cheerpjInit({
				natives: { Java_Example_nativeAlert },
			});
			await cheerpjRunMain("Example", "/app");
		</script>
	</body>
</html>
```

In this setup, [`cheerpjInit`] loads `Java_Example_nativeAlert` as the native method implementation. When `Example.nativeAlert` is called in Java, it triggers the JavaScript `Java_Example_nativeAlert` function, displaying an alert dialog with the message.

## Calling back into Java from JavaScript

You can call back into Java from a JavaScript native method implementation using the `lib` parameter. The `lib` object exposes your Java classes so you can invoke their static methods.

```java
public class ClassName {
  // Implemented in JavaScript
  public static native void nativeMethodName();

  public static void javaMethodName() {
    // Your Java logic here
  }

  public static void main(String[] args) {
    nativeMethodName(); // Triggers the JS implementation
  }
}
```

The `ClassName` class defines a `native method` called `nativeMethodName`, which will be implemented in JavaScript. It also includes a public method, `javaMethodName`, that performs some Java logic.

In the JavaScript implementation of `nativeMethodName`, you can use the `lib` parameter to access the `ClassName` Java class and call its methods from JavaScript. This allows JavaScript code to call back into Java and execute Java logic directly from the browser.

```js
// Example placeholders — replace ClassName/javaMethodName with your own
async function Java_ClassName_nativeMethodName(lib) {
	const ClassName = await lib.ClassName; // Access your Java class
	await ClassName.javaMethodName(); // Call a Java static method
}
```

This functionality is useful when you need to call back into the Java class in response to a native function call. If you need to call back into Java outside the context of a native function, you can use a long-running Java thread. You can learn more about how to achieve this in our [`Java and JavaScript Interoperability`] tutorial.

## Converting Parameters and Return Values

Parameters and return values of JNI calls are automatically converted between JavaScript and Java types based on [`conversion rules`].

[`natives`]: /docs/reference/cheerpjInit#natives
[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/CJ3Library#conversion-rules
[`cheerpjInit`]: /docs/reference/cheerpjInit
[`Java and JavaScript Interoperability`]: /docs/tutorials/interoperability-tutorial
