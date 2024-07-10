---
title: "`webMain`"
description: Prefer the `webMain` entry point over `main`
---

The `main` function is the traditional entry point of a C++ program. It also contains the whole program, which terminates after the `main` function returns.

When targeting the browser, you should **avoid using `main`, and use `webMain` instead**. However, if `webMain` is absent, `main` will be used as the entry point instead.

Your `webMain` should initialize the program, set up event handlers, and **return control to the browser as soon as possible**. After returning, the browser notifies the events you registered handlers for. If the entry point runs for a long time, the main thread will lock up and the browser tab might freeze.

## Signature

```cpp
void webMain()
```

`webMain` is `void` and takes no arguments because there is no shell environment for Cheerp to take command-line arguments from or pass an exit code to.

> [!tip] Command-line arguments
> If your program absolutely needs to have command-line arguments passed in the standard way (through `argc` and `argv` parameters to `main`), you should use `main` instead of `webMain` and [pass args](/docs/reference/args).

## In Cheerp, global objects outlive the entry point

Consider this program:

```cpp
#include <iostream>

class C {
public:
  C() {
    std::cout << "Constructor\n";
  }
  ~C() {
    std::cout << " and Destructor\n";
  }
};

C global;

int main() {
  return 0;
}
```

If we compile the following program with a native compiler and run it, the resulting output will be `Constructor\n and Destructor\n`. However, compiling this program with Cheerp and running it will give `Constructor\n`!

Global objects outlive the call to the entry point, as it is meant for performing initializations/setting up event listeners. Due to these differing semantics, prefer `webMain` over `main`.
