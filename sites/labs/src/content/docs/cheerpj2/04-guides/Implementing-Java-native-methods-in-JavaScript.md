---
title: Implementing native methods
---

With CheerpJ, it is possible to implement Java 'native' methods (that would normally be implemented in C/C++ or other AOT-compiled language) in JavaScript, similarly to what would be done in regular Java using the Java Native Interface (JNI).

## Java Native Methods

Take as an example the following Java class

```java title="SomeClass.java"
public class SomeClass {
    public static void someStaticMethod() {
        ...
    }
    public float someInstanceMethod() {
        ...
    }
    public native int someNativeMethod();
}
```

Java will search for the implementation of `someNativeMethod` using the JNI.

When compiling this class with CheerpJ, a JavaScript implementation of this method will need to be provided. Implementing native Java methods in JavaScript can be useful to use browser functionalities that are not currently exposed at the Java level.

## Java Native Methods in CheerpJ

Implementing native methods is simply a matter of adding a JavaScript function in the global scope with a correctly mangled signature.

Since this is a rather involved process, the `cheerpjfy.py` script provides functionality to simplify the process by using the `--stub-natives=destinationDir` command line option.

Assume the previous class has been compiled and packaged in `some.jar`, to generate a directory tree for JS native code you can do:

```shell
mkdir native/
cheerpjfy.py --stub-natives=native/ some.jar
```

This will generate a tree of directories under the `native` folder, which will replicate the Java package structure. Each class with at least one native method will generate a `ClassName_native.js` stub file ready to be implemented.

```js title= "Someclass_native.js"
function _CHEERPJ_COMPRESS(ZN9Someclass16someNativeMethodEVEI)(a0,p)
{
	/*instance*/
	debugger
}

```

Once all have been implemented, native methods can be packaged with the compiled code using the following command:

```shell
cheerpjfy.py --natives=native/ some.jar
```

CheerpJ uses a compression scheme to encode mangled signatures. The `CHEERPJ_COMPRESS` macro is used automatically by the `cheerpjfy.py --stub-natives=` command, but can also be used manually. For more information about macros visit [this page](/cheerpj2/reference/Command-Line-Options#--stub-nativesnativespath).
