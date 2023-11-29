---
title: Changelog
---

Version 3.0 RC2 - November 29th, 2023:

```
* Reduced verbosity of debug messages
* Support for synchronised methods in the JIT
* Restored support for AWT at the same level of CheerpJ 2.3
* Improved reflection support
* Support for running in Web Workers
* Improved clipboard support
* Improved library mode with support object fields, arrays, instanceof and quality-of-life and debugging
* Improved support for fonts
* Improved support for class loaders
* Fixed preloading support
* Support for ClassCastException

```

version 3.0 - September 22nd, 2023:

```

Focus on performance, particularly on startup time
* Multiple fixes on the Cheerp compiler to better optimize JNI code
* Multiple experiments on the JIT to better interact with V8 tiering
```

version 3.0 - September 15th, 2023:

```
Work on CJ3 Library mode, with a focus on performance and Java <-> JS type conversions
* Optimized away context switching overhead on user native calls
* Support many more type conversion between JS numbers/integers/booleans and Java primitive types
* Support conversion between JS numbers and Java boxed types (i.e. java.lang.Integer)
* JIT optimizations
* Optimization of the core class loading code path
```

version 3.0 - September 8th, 2023:

```
JNLP support and performance work
* Significant speed up of System.arrayCopy
* JIT optimizations
```

version 3.0 - September 1st, 2023:

```
Focus on networking
* Integrated Tailscale support for low level TCP/UDP traffic, same code we use for WebVM/CheerpX
* Custom HTTP/HTTPS handlers are now enabled by default unless Tailscale is used. The handlers provide http/https support in common cases.
* Optimized exception handling
* Optimized code rendering
* Multiple JIT optimizations
```
