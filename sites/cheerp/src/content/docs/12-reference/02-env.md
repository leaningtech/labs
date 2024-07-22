---
title: Environment variables
description: Passing environment variables to your application
---

Cheerp has support for environment variables.

## Providing environment variables

The ways to provide environment variables depend on which target you are compiling to.

### JavaScript modules

For JavaScript modules, you can pass environment variables through the initialization function like this:

```js
import init from "./example.js";

await init({
	env: ["A=1", "B=2"],
});
```

### WASI-CLI

When targeting WASI, Cheerp uses the WASI-CLI interface to recieve environment variables, meaning that it will work on any
runtime that has implemented the [WASI-CLI proposal](https://github.com/WebAssembly/wasi-cli).

The exact flag differs between runtimes. With Wasmtime, it's `--env`:

```shell
$ wasmtime --env A=1 --env B=2 example.wasm
```

### Other

When targeting something else, you can provide environment variables and program arguments by defining a global variable called `CHEERP_ENV`:

```js
globalThis.CHEERP_ENV = ["A=1", "B=2"];
```

Changes to `CHEERP_ENV` after `main` has run will not be reflected in the environment.

## Reading environment variables

In C/C++, environment variables can be read as usual, for example using [`getenv`](https://en.cppreference.com/w/cpp/utility/program/getenv).

## Nonstandard third `main` parameter

Alternatively, Cheerp supports this nonstandard `main` signature:

```c
int main(int argc, char **argv, char **env)
```

### Limitations

It is not possible to receive environment variables in `main` when the `main` function is in a different section than the target.

In these cases, you can still get environment variables with the `getenv` function.
