---
title: Implementing native methods
subtitle: Java Native Interface (JNI) with CheerpJ
---

With CheerpJ, it is possible to implement Java 'native' methods (that would normally be implemented in C/C++ or other AOT-compiled language) in JavaScript, similarly to what would be done in regular Java using the Java Native Interface (JNI).

As an example, consider the following Java class:

```java title="TestClass.java"
public class TestClass {
  public native void alert(String str);
}
```

To provide an implementation of `someNativeMethod` in JavaScript, pass it to the `cheerpjInit` function as a property of the `natives` object:

```js
cheerpjInit({
	natives: {
		Java_TestClass_alert(lib, str) {
			alert(str);
		},
	},
});
```

> [!todo] TODO
> Explanation of lib parameter, also consider calling it env to match native JNI

> [!todo] TODO
> Explanation of how method names are resolved ([it's not the same as native JNI](https://docs.oracle.com/javase/8/docs/technotes/guides/jni/spec/design.html#resolving_native_method_names))
