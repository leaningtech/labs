---
title: "`[[noinit]]`"
---

> [!tip] genericjs only
> This attribute is relevant to genericjs only.

This attribute can be applied to any object. It is a type safe alternative to the following C++ idiom used to allocate storage for an object without actually constructing/initializing it. In the sample below `T` stands for any type.

```cpp
typename aligned_storage<sizeof(T)>::type obj;
```

Most usually a placement new is then used to construct the object in place. This solution may be required if you need strict, manual control on object initialization. The `[[noinit]]` attribute lets you directly use an object of the right type, but the compiler will not call the constructor on it.

The equivalent code using `[[noinit]]` is:

```cpp
T obj [[noinit]];
```

Please note that, similarly to the usual, type-unsafe solution you have to manually invoke the destructor as required.
