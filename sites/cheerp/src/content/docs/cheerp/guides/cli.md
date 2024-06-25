---
title: Arguments and environment variables
---

Cheerp (nightly) has support for passing arguments and environment variables to your programs. The way you pass them
depends on whether you're compiling for WASI, ES6 or something else.

For all the examples we'll use the following example program:

```c title=test.c
#include <stdio.h>

int main(int argc, char **argv, char **env) {
  for (int i = 0; i < argc; ++i)
    printf("arg: %s\n", argv[i]);

  for (int i = 0; env[i]; ++i)
    printf("env: %s\n", env[i]);
}
```

## WASI

Cheerp uses the WASI-CLI interface to get the arguments and environment variables, meaning that it will work on any
runtime that has implemented the [WASI-CLI proposal](https://github.com/WebAssembly/wasi-cli).

Here we'll be using `wasmtime`:

```shell
$ /opt/cheerp/bin/clang -target cheerp-wasm-wasi test.c
$ wasmtime --env A=1 --env B=2 a.out a b c
arg: a.out
arg: a
arg: b
arg: c
env: A=1
env: B=2
```

## ES6 modules

For [ES6 modules](/cheerp/guides/ES6-Modules), you can pass the arguments through the initialization function like this:

```js title=main.mjs
import init from "./test.mjs";

init({ argv: ["a", "b", "c"], env: ["A=1", "B=2"] }).then((module) => {});
```

```shell
$ /opt/bin/clang test.c -cheerp-make-module-es6 -o test.mjs
$ node main.mjs
arg: a
arg: b
arg: c
env: A=1
env: B=2
```

## Other

When not building WASI or ES6 modules, you can provide environment variables and program arguments by defining the following global variables in JavaScript before
the call to `main`:

- `CHEERP_ENV`
- `CHEERP_ARGV`

Do note that changes to `CHEERP_ENV` after `main` has run will not be reflected in `environ`.

```bash
/opt/bin/clang test.c -cheerp-pretty-code -o test.js
```

Then we open the file and place the following near the top:

```js "var CHEERP_ARGV=["a", "b", "c"];" "var CHEERP_ENV=["A=1", "B=2"];"
"use strict";
/*Compiled using Cheerp (R) by Leaning Technologies Ltd*/
var __imul = Math.imul;
var __fround = Math.fround;
var CHEERP_ARGV = ["a", "b", "c"];
var CHEERP_ENV = ["A=1", "B=2"];
var oSlot = 0;
var nullArray = [null];
var nullObj = { d: nullArray, o: 0 };
// ...
```

Then running it:

```shell
$ node test.js
arg: a
arg: b
arg: c
env: A=1
env: B=2
```

## NodeJS

When running your program with NodeJS, you can also specify program arguments and/or environment variables like this:

```shell
$ node test.js --cheerp-env=A=1 --cheerp-env=B=2 --cheerp-arg=a --cheerp-arg=b --cheerp-arg=c
arg: a
arg: b
arg: c
env: A=1
env: B=2
```

This will only work if you didn't pass them in a different way (e.g. using `CHEERP_ENV` or `CHEERP_ARGV`)

## Limitations

Due to technical reasons, it is currently not possible to receive arguments and/or environment variables in `main` when
the `main` function is in a different section than the target. For example the following won't work when compiled with
the flag: `-target cheerp`:

```c title=test.cc
#include <stdio.h>

[[cheerp::wasm]] int main(int argc, char **argv, char **env) {
  for (int i = 0; i < argc; ++i)
    printf("arg: %s\n", argv[i]);

  int i = 0;
  while (env[i])
    printf("env: %s\n", env[i++]);
}
```

In these cases, you can still get environment variables with the `getenv` function, the only limitation is that you
can't get them for the arguments to `main`.
