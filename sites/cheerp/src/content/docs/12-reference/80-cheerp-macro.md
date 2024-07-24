---
title: "`__CHEERP__` macro"
---

Cheerp defines the `__CHEERP__` preprocessor macro. This lets you perform conditional compilation for when a codebase is set up to simultaneously compile with both Cheerp and a native C++ compiler.

## Example usage

```cpp
#ifdef __CHEERP__
assert(false && "Missing support for ...");
#else
// Your original code, it will still compile if you switch to a native target
#endif
```
