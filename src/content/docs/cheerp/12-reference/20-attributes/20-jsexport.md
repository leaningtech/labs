---
title: "`[[cheerp::jsexport]]`"
description: Expose a function, class, or struct to JavaScript
---

The `[[cheerp::jsexport]]` attribute can be applied in C++ code either to free functions or to `class` and `struct` definitions.

Every definition tagged with this attribute will be directly exposed to JavaScript.

## Example

```cpp
#include <cheerp/clientlib.h>

[[cheerp::jsexport]] int factorial(int n)
{
        if (n < 2)
                return 1;
        return n * factorial(n-1);
}

class [[cheerp::jsexport]][[cheerp::genericjs]] JsStruct
{
private:
        float a;
        int b;
public:
        JsStruct(float _a):a(_a),b(0)
        {
                client::console.log("Instance created");
        }
        void test()
        {
                client::console.log("Invoked test", a, b++);
        }
};
```

This example exposes `factorial` free function to be called like a regular JavaScript function.
The `JsStruct` class will also be exported and instances can be created via `new` in JavaScript, for example:

```js
var testExport = new JsStruct(3.0); // Instance created
testExport.test(); // Invoked test 3.0 1
testExport.test(); // Invoked test 3.0 2

console.log(factorial(23)); // 862453760
```

## JSExported free functions limitations

- arguments/return types: no 64 bit integers (we may support this in the future using BigInt). The basic `int`/`float`/`double` types are supported.
- arguments/return types: only pointers (and references) to struct/classes tagged as `[[cheerp::jsexport]]` (representing native-like objects) or pointers (and references) to "native" JavaScript objects (DOM elements, Strings, Arrays, Sets or more complex objects declared on the JavaScript code). Pointers to functions (with some restrictions) are also supported.
- naming: there can't be 2 jsexported function that share the same name (as in the literal name, since C++ overloading rules are based on parameter types and that does not naturally map to JavaScript we have to be more restrictive)
- no templated functions (there is no way of instantiating templates at runtime from JavaScript)

Free function tagged with `[[cheerp::genericjs]]` or `[[cheerp::wasm]]` (directly or via the `-target` option) are both compatible with the `[[cheerp::jsexport]]` attribute.

## JSExported class/struct limitations

- no inheritance
- the class/struct needs to have a public constructor
- the class/struct needs to have at least a non-static jsexported method
- "promise" and "valueOf" are reserved names

Classes tagged with `[[cheerp::genericjs]]` or `[[cheerp::wasm]]` (directly or via the `-target` option) are both compatible with the `[[cheerp::jsexport]]` attribute.

The same restrictions on free functions are also imposed on all JSExported methods.

Some of these restrictions will be relaxed in future releases, but we strive to offer a forward compatible interface, so that a code compiled with the current restrictions will be also valid in future releases.

If you create a JSExported object with `new` in JavaScript, **you are responsible of calling the special `delete()` method at the end of the object lifetime**, to run the destructor and free memory (if the objects resides in linear memory or holds members that do). The same applies whenever the C++ API that you are exporting is handing out the ownership of an object to JavaScript.

Member fields (either static or not) are not JsExported (but you define getter / setter methods).

The `[[cheerp::jsexport]]` attribute can be applied to C++ class and struct definitions, to expose them to JavaScript.

A basic example of its usage would be:

```cpp
class [[cheerp::jsexport]][[cheerp::genericjs]] JsStruct
{
private:
        float a;
        int b;
public:
        JsStruct(float _a, int _b):a(_a),b(_b)
        {
        }
        void test()
        {
                client::console.log("Invoked test");
        }
};

[[cheerp::jsexport]]
int factorial(int N) {
        if (N < 2)
                return 1;
        return N * factorial(N-1);
}
```

This example exposes the a factorial free function and a JsStruct class, and allows one to create and use the JsStruct instances from JavaScript, for example:

```js
var testExport = new JsStruct(3.0, 42);
testExport.test();

console.log(factorial(5));
```

Classes or struct that have to be JSExported have to tagged with both `[[cheerp::jsexport]]` and `[[cheerp::genericjs]]`.

## Clobbering names

Cheerp minifies the output by default (unless the `-cheerp-pretty-code` option is used). This happens by assigning the smallest possible symbols to the most used local or global variables. If you need to use temporary variables in inline asm code you need to declare those variables in the clobber list, for example

```cpp
__asm__("(function(){var jsTemp1=%0; var jsTemp2=jsTemp+1; console.log(jsTemp2);})()" : /*No output*/ : "r"(42) : /*Clobber list*/ "jsTemp1","jsTemp2"); // This will print out "43"
```

All names declared as clobbered will be globally excluded from the list of symbol that are used for minification. The effect is the same as marking those names as reserved using the `-cheerp-reserved-names` command line option. For best results we recommend to choose temporary names while keeping the following into account:

- Using very short names (i.e. 1 or 2 letters) will reserve those symbols during minification, which may have a significant impact in terms of code size.
- Using names with a leading underscore (i.e `_foo`) may cause collisions with symbols in the global scope if `-cheerp-pretty-code` is used.
- For best compatibility we recommend to choose temporary values **at least 3 letters long and without a leading underscore**.

## Promise

All JSExported functions or classes have a member .promise, and no use of these classes or functions should be done before the promise has been resolved. Since the promise may generally include asynchronous fetching of files via HTTP (e.g. the wasm file), the recommended behaviour is to always check that the promise has been resolved. Eg.:

```js
yourFunctionName.promise.then(function () {
	arbitraryCode();
	yourFunctionName(4, 5.023);
	//etc
});
```

## Advanced usage: selecting JSExported interface

The default behaviour of the compiler is that if a class has a tag `[[cheerp::jsexport]]`, all its public methods (static or not) will be JSExported. This can be relaxed by selecting a non-empty subset of the public interface, and tagging only the methods you are interested in exporting with the attribute `[[cheerp::jsexport]]`.

As with all other Cheerp-specific attributes, other compilers will still parse code, so it can be used to target different platforms (eg. native and Web).

<!-- TODO: Special considerations apply when using the `jsexport` attribute and WebAssembly output -->

