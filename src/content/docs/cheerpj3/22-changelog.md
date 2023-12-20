---
title: Changelog
---

## [3.0rc2](/blog/cheerpj-30rc2) - November 29, 2023

```html
<script src="https://cjrtnc.leaningtech.com/3.0rc2/cj3loader.js"></script>
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

## [3.0rc1](/blog/cheerpj-30rc1) - October 18, 2023

```html
<script src="https://cjrtnc.leaningtech.com/3.0rc1/cj3loader.js"></script>
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

[CheerpJ 3.0 was a major architectural rewrite of CheerpJ](/blog/cheerpj-3-deep-dive).

For previous versions, see the [CheerpJ 2.x changelog](/cheerpj2/changelog).
