---
title: CMake
subtitle: How to build a CMake project using Cheerp
---

CMake projects can be compiled with Cheerp by passing a single additional command-line flag to `cmake`.

A CMake toolchain file is provided at `$CHEERP/share/cmake/Modules/CheerpToolchain.cmake`, where the `CHEERP` environment variable is set to the path of your Cheerp installation.

For example:
- On Linux: `export CHEERP=/opt/cheerp`
- On macOS: `export CHEERP=/Applications/cheerp`
- On Windows: `set CHEERP=C:\cheerp`

Then pass the toolchain file when configuring the project.
```bash
cmake -DCMAKE_TOOLCHAIN_FILE=$CHEERP/share/cmake/Modules/CheerpToolchain.cmake .
```

## Compiling to WebAssembly

To compile with `-target cheerp-wasm`, use `CheerpWasmToolchain.cmake`. 
```bash
cmake -DCMAKE_TOOLCHAIN_FILE=$CHEERP/share/cmake/Modules/CheerpWasmToolchain.cmake .
```

## Example

See [this example repository](https://github.com/nanaian/minimal-cmake-cheerp) for a working example.
