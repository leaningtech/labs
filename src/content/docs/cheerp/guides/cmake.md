---
title: CMake
---

A CMake toolchain file is provided in `<installation directory>/share/cmake/Modules/CheerpToolchain.cmake`. For example, on Linux:

```bash
cmake -DCMAKE_TOOLCHAIN_FILE=/opt/cheerp/share/cmake/Modules/CheerpToolchain.cmake <regular arguments>
```

Currently, only building static libraries is supported.
