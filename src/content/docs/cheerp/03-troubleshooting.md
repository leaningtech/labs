---
title: Troubleshooting
---

## RuntimeError: memory access out of bounds

`RuntimeError: memory access out of bounds` can occur if there is not enough heap memory. To increase the heap size, set `-cheerp-linear-heap-size=<value>` to a larger value (in MB, default is 1).

## Passing data to WebGL uniform\* APIs

`uniform*` APIs and, more in general, WebGL APIs which expects buffer requires typed arrays of a suitable type.

If you have data stored in a C/C++ array or `std::vector` or any other contiguous memory storage, you can use the [`cheerp::MakeTypedArray`](/cheerp/guides/porting/Conversion-between-arrays-and-Typed-Arrays#maketypedarray) to convert the data into a JS typed array object. Please note that the conversion happens without copying, so it's very efficient.
