---
title: "`CHEERP_SAFE_INLINE`"
---

This macro is designed to quickly introduce genericjs code inside wasm code.

```cpp
CHEERP_SAFE_INLINE(returnType, (type1 arg1, type2 arg2), { /* ... */ }, param1, param2);
```

## Example

```cpp
[[cheerp::wasm]] double wasmCompiledCode(const char* str) {
  return CHEERP_SAFE_INLINE(double, (const char* s), {
    client::console.log(s);
    return client::pubDate::now();
  }, str);
}
```
