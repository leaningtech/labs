---
title: Implementing Native Methods
description: Java Native Interface (JNI) with CheerpJ
---

CheerpJ allows you to implement Java native methods (typically written in C/C++ or another AOT-compiled language) directly in JavaScript, similar to the Java Native Interface (JNI) in standard Java.

In Java, native methods are identified by the `native` keyword in their declaration. These methods are not implemented in Java but are instead defined in an external language, which in the case of CheerpJ, is JavaScript.

## Implementing Native Methods in JavaScript

To implement a native method in JavaScript, create an `async` function that follows the naming convention `Java_<ClassName>_<MethodName>`. The function takes:

- A [`CJ3Library`] object `lib` as the first parameter (which provides access to other classes and methods within the library).
- `self` as the second parameter, the instance of the Java class calling the native method. This parameter can be omitted for static native methods.
- The native method’s parameters as subsequent parameters.

And returns a value or a Promise that resolves to a value. The function syntax is as follows:

```js
async function Java_<ClassName>_<MethodName>(lib, self, param1, param2, ...) {
  // Implementation
}
```

> [!info] Handling Static Native Methods
> If the native method is static, the `self` parameter can be omitted.

### Converting Parameters and Return Values

Parameters and return values of JNI calls are automatically converted between JavaScript and Java types based on [`conversion rules`].

## Initializing CheerpJ with the `natives` Option

To use the native method in CheerpJ, pass the function to the `cheerpjInit` function as a property of the [`natives`] option. You can pass:

1. **The function definition directly**:

```js
await cheerpjInit({
	natives: {
		async Java_Example_alert(lib, str) {
			window.alert(str);
		},
	},
});
```

2. **Or just the function name if it was defined earlier**:

```js
async function Java_Example_alert(lib, str) {
	window.alert(str);
}

await cheerpjInit({ natives: { Java_Example_alert } });
```

## Example Walkthrough

Here’s a full example that demonstrates the native method setup in Java and its JavaScript implementation.

1. Declare a native method in Java using the `native` keyword:

```java title="Example.java"
public class Example {
  public static void main(String[] args) {
    alert("Hello, world!");
  }

  public static native void alert(String message);
}
```

2. Implement the native method by creating an `async` function in JavaScript that follows the naming convention `Java_<ClassName>_<MethodName>`.

```js title="index.html"
// Native method implementation
async function Java_Example_alert(lib, str) {
	window.alert(str);
}
```

Here, we provide an implementation for the `alert` method in the `Example` class, by creating a function named `Java_Example_alert`. The function displays an alert dialog with the message using `window.alert`.

3. Initialize CheerpJ with the `natives` option and pass the native method implementation to `cheerpjInit`:

```js title="index.html"
// Native method implementation
async function Java_Example_alert(lib, str) {
	window.alert(str);
}

// Initializing CheerpJ
await cheerpjInit({ natives: { Java_Example_alert } });
await cheerpjRunMain("Example", "/app/");
```

In this setup, `cheerpjInit` loads `Java_Example_alert` as the native method implementation. When `Example.alert` is called in Java, it triggers the JavaScript `Java_Example_alert` function, displaying an alert dialog with the message.

[`natives`]: /docs/reference/cheerpjInit#natives
[`CJ3Library`]: /docs/reference/CJ3Library
[`conversion rules`]: /docs/reference/CJ3Library#conversion-rules
