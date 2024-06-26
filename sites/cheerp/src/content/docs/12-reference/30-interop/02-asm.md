---
title: "`__asm__`"
---

To inline JavaScript code in the middle of genericjs section code, use the `__asm__` keyword. Similar to a traditional architecture, the `__asm__` keyword lets you to write native (JavaScript) code. This functionality can be used to interface with external JS libraries which have no Cheerp-compatible headers yet.

```cpp
__asm__(code : output constraints : input constraints : clobber constraints)
```

- `__asm__` is only supported in functions tagged with the `[[genericjs]]` attribute.
- Code inside `__asm__` should never throw to the external scope, and should consist of a single JS expression or statement without the final `;`.
- Both the input constraints and clobber constraints parts are optional.
- Only the `"r"` constraint is supported. It represents a local variable in the generated JS code (equivalent to a register on traditional architecture).
- Only integral types, floating point types and pointers to object in the `client` namespace (i.e. DOM or native JavaScript objects) can be used.

## Example

```cpp
__asm__("alert('Alert from __asm__')");
```

It is possible to pass arguments and get values back from inline JavaScript:

```cpp
int stringLength;
client::String* stringFromDom = ...;
__asm__("%1.length" : "=r"(stringLength) : "r"(stringFromDom));
assert(stringLength == stringFromDom->get_length());
```
