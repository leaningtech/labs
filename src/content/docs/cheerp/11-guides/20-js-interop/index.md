---
title: JavaScript interoperabiity
# TODO: split into pages
---

Cheerp implements three advanced interoperability mechanisms to interface C++ code with pure JavaScript:

- Expose C++ classes and methods to JavaScript code
- Inlining JavaScript code within a C++ codebase.
- Use JavaScript methods and classes directly from C++

# The CHEERP_OBJECT macro

A common use case for inline asm is to return a literal object to JavaScript:

```cpp
double field1 = 1;
client::String* field2 = new client::String("hello");
client::Object* result;
__asm__("{field1:%1,field2:%2}" : "=r"(result) : "r"(field1), "r"(field2));
```

This is usually much more performant than creating a `new client::Object()` and populating it with the `set_()` method.

The `CHEERP_OBJECT` macro can be used to achieve the same result without the boilerplate and with a more elegant syntax:

```cpp
double field1 = 1;
client::String* field2 = new client::String("hello");
client::Object* result = CHEERP_OBJECT(field1, field2);
```

Currently the macro has the following limitations:

- The maximum number of arguments is 16
- The arguments need to be global or local variable names, and the same names will be used for the js object fields

# The client namespace

Cheerp treats every function and class inside the `client` namespace as a declaration for something implemented by the browser or JavaScript. You are free to add new declarations there for functions implemented in JavaScript. For example:

```cpp
namespace [[cheerp::genericjs]] client
{
	int someJavaScriptMethod(int arg1, const String& arg2);
}

[[cheerp::genericjs]]
void webMain()
{
	printf("JavaScript returned %i\n", client::someJavaScriptMethod(42, "This is converted to a JavaScript String"));
}
```

And on the JavaScript side:

```js
function someJavaScriptMethod(arg1, arg2) {
	return arg1 - arg2.length;
}
```


# The `cheerp::ArrayRef` class and `cheerp::makeArrayRef` helpers

Cheerp provides an helper class to simplify access to JS array-like objects, such as `client::Array` and `client::Int32Array`. It's common to pass them as pointers, which makes it inconvenient to use the `operator[]` to access their elements. The `cheerp::ArrayRef` class can be wrapper around a pointer to use the `operator[]` more naturally. `cheerp::makeArrayRef` is an helper to automatically deduce the right template type for the `cheerp::ArrayRef` class.

```cpp
// Code without using cheerp::ArrayRef
int sumAllElements(client::Int32Array* ar)
{
    int ret = 0;
    for(int i=0;i<ar->get_length();i++)
        ret += (*ar)[i];
    return ret;
}

// Code with cheerp::ArrayRef
int sumAllElements(client::Int32Array* ar)
{
    auto ref = cheerp::makeArrayRef(ar);
    int ret = 0;
    for(int i=0;i<ref->get_length();i++)
        ret += ref[i];
    return ret;
}
```
