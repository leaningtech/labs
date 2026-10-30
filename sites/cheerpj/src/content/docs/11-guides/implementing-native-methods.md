---
title: Implementing Native Methods
description: Java Native Interface (JNI) with CheerpJ
---

This guide explains how to implement Java **native methods** in JavaScript with CheerpJ.

On the desktop, Java native methods are usually written in C or C++ and called through the Java Native Interface (JNI). Pre-built native binaries cannot run in the browser, so CheerpJ lets you implement native methods in JavaScript instead, where they can use JavaScript libraries and any Web API the browser offers. Native code can also be compiled to WebAssembly; [get in touch](https://cheerpj.com/contact/) if your application needs it.

In Java, native methods are marked by the `native` keyword in their declaration. They are not implemented in Java, but in another language: with CheerpJ, JavaScript.

## Steps to implement native methods in CheerpJ

To implement native methods in CheerpJ:

1. Declare a native method in Java using the `native` keyword.
2. Implement the native method in JavaScript.
3. Pass the native function to CheerpJ.

### Declaring native methods in Java

To declare a native method in Java, use the `native` keyword in the method declaration. The method is declared in the Java class but not implemented in Java. Its implementation is provided in JavaScript.

```java
public class ClassName {
  // Native method declaration
  private native void methodName(param1, param2, ...);
}
```

### Implementing native methods in JavaScript

To implement a native method in JavaScript, create an `async` function named after the Java method: `Java_<fully-qualified-class-name>_<method-name>`. For instance, if `com.foo.Bar` has a native method called `baz`, the function is called `Java_com_foo_Bar_baz`.

The JavaScript function should accept the following parameters:

- A [`CJ3Library`] object `lib` as the first parameter, which gives access to the application's Java classes and methods. Use it to [call back into Java](#calling-back-into-java-from-javascript).
- `self` as the second parameter: the Java object the native method was called on. Static native methods do not have this parameter.
- The native method's own parameters after these.

The function returns a value, or a Promise that resolves to a value. The syntax is:

```js
async function Java_<fully-qualified-class-name>_<method-name>(lib, self, param1, param2, ...) {
  // Implementation
}
```

> [!info] Handling static native methods
> If the native method is static, there is no `self` parameter: the method's own parameters follow `lib`.

### Initialising CheerpJ with the `natives` option

Pass the function to [`cheerpjInit`] as a property of the [`natives`] option. There are two ways to do this. The examples implement a static native method, so the function has no `self` parameter.

1. **Define the function inside the option**

```js
await cheerpjInit({
	natives: {
		async Java_Example_nativeMethodName(lib, str) {
			// Implementation
		},
	},
});
```

2. **Or pass a function defined earlier, by name**

```js
async function Java_Example_nativeMethodName(lib, str) {
	// Implementation
}

await cheerpjInit({ natives: { Java_Example_nativeMethodName } });
```

## Example walkthrough

This full example declares a native method in Java and implements it in JavaScript.

1. Declare a native method in Java using the `native` keyword:

```java title="Example.java"
public class Example {
  public static void main(String[] args) {
    nativeAlert("Hello, world!");
  }

  public static native void nativeAlert(String message);
}
```

2. Implement the native method in JavaScript, with an `async` function named `Java_<fully-qualified-class-name>_<method-name>`. `nativeAlert` is static, so the function has no `self` parameter.

```js title="index.html"
async function Java_Example_nativeAlert(lib, str) {
	window.alert(str);
}
```

The function `Java_Example_nativeAlert` implements the `nativeAlert` method of the `Example` class. It shows the message in an alert dialog with `window.alert`.

3. Initialise CheerpJ with the `natives` option, passing the native method implementation to [`cheerpjInit`]:

```html title="index.html" {14}
<!doctype html>
<html>
	<head>
		<title>Native Method Example</title>
		<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>
	</head>
	<body>
		<script type="module">
			async function Java_Example_nativeAlert(lib, str) {
				window.alert(str);
			}
			// Init CheerpJ and register natives, then run your main
			await cheerpjInit({
				natives: { Java_Example_nativeAlert },
			});
			await cheerpjRunMain("Example", "/app/");
		</script>
	</body>
</html>
```

[`cheerpjInit`] registers `Java_Example_nativeAlert` as the implementation of the native method. When Java calls `Example.nativeAlert`, CheerpJ runs the JavaScript `Java_Example_nativeAlert` function, which shows the message in an alert dialog.

## Calling back into Java from JavaScript

A JavaScript native method can call back into Java through its `lib` parameter. The `lib` object gives access to your Java classes, so you can call their static methods, create objects and call their instance methods.

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

The `ClassName` class declares a native method, `nativeMethodName`, implemented in JavaScript. It also has a public method, `javaMethodName`, with some Java logic.

The JavaScript implementation of `nativeMethodName` uses `lib` to load the `ClassName` class and call `javaMethodName`.

```js
// Example placeholders — replace ClassName/javaMethodName with your own
async function Java_ClassName_nativeMethodName(lib) {
	const ClassName = await lib.ClassName; // Access your Java class
	await ClassName.javaMethodName(); // Call a Java static method
}
```

This works for calls into Java made in response to a native method call. To call into Java at any other time, use a long-running Java thread, as shown in the [`Java and JavaScript Interoperability`] tutorial.

## Converting parameters and return values

Parameters and return values of JNI calls are automatically converted between JavaScript and Java types based on [`conversion rules`].

[`natives`]: /docs/reference/cheerpjInit#natives
[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/CJ3Library#conversion-rules
[`cheerpjInit`]: /docs/reference/cheerpjInit
[`Java and JavaScript Interoperability`]: /docs/tutorials/interoperability-tutorial
