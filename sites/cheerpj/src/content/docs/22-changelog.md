---
title: Changelog
---

## [3.0](https://cheerpj.com/cheerpj-3-now-generally-available/) - February 1, 2024

```html
<script src="https://cjrtnc.leaningtech.com/3.1/cj3loader.js"></script>
```

- Support all Java opcodes in the JIT
- Better support for missing JNI symbols
- Improved support for socket syscalls
- Support for loading native libraries as JavaScript modules
- Support zero-copy passing of primitive arrays in library mode
- Restore support for image filtering
- Restore support for printing
- Optimized font handling
- Improved error message when server does not support content ranges

## [3.0rc2](https://labs.leaningtech.com/blog/cheerpj-3-deep-dive) - November 29, 2023

```html
<script src="https://cjrtnc.leaningtech.com/3.1/cj3loader.js"></script>
```

- Reduced verbosity of debug messages
- Support for `synchronised` methods in the JIT
- Restored support for AWT to the same level as CheerpJ 2.3
- Improved reflection support
- Support for Web Workers (just use `importScripts`)
- Improved clipboard support
- Improved library mode with support object field access, arrays, `instanceof`, quality-of-life and debugging
- Improved support for fonts
- Improved support for class loaders
- Fixed preloading support
- Support for `ClassCastException`
- `cheerpjAddStringFile` deprecated, renamed to `cheerpOSAddStringFile`

## [3.0rc1](https://cheerpj.com/announcing-cheerpj-3-0rc1-help-us-test-and-improve/) - October 18, 2023

```html
<script src="https://cjrtnc.leaningtech.com/3.1rc1/cj3loader.js"></script>
```

- Completely new JIT-based architecture
  - Removed AOT compiler
- Full classloader support
- New scalable JNI architecture (`cheerpjInit` `natives` option)
- Library mode (`cheerpjRunLibrary`)
  - Removed `cjCall` and `cjNew`
- `cheerpjInit` is now asynchronous
- `cheerpj-dom.jar` removed
- `cheerpjRunJarWithClasspath` removed
- `CheerpJWorker` removed (3.0rc2 adds support for `importScripts`)
- `com.leaningtech.handlers` HTTP handler no longer needed. HTTP(S) requests just work

## Previous versions

[CheerpJ 3.0 was a major architectural rewrite of CheerpJ](https://labs.leaningtech.com/blog/announcing-cheerpj-3).

For previous versions, see the [CheerpJ 2.x changelog](https://labs.leaningtech.com/docs/cheerpj2/changelog).
