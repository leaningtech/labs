---
title: "Arguments: `argv` and `argc`"
description: Passing command-line arguments to your application
---

Cheerp supports recieving arguments in `main`. For example, you might have a `main` function that looks like this:

```c
int main(int argc, char **argv) {
  for (int i = 0; i < argc; ++i)
    printf("arg: %s\n", argv[i]);
}
```

> [!warning] Targeting the browser
> If you are targeting the browser, `main` is supported, but in most cases you should try to use `webMain` instead and recieve arguments in a different way.

The ways to provide arguments depend on which target you are compiling to.

### JavaScript modules

For JavaScript modules, you can pass the arguments through the initialization function like this:

```js title=main.js
import init from "./example.js";

await init({
  argv: ["a", "b", "c"],
});
```

### WASI-CLI

When targeting WASI, Cheerp uses the WASI-CLI interface to get arguments, meaning that it will work on any
runtime that has implemented the [WASI-CLI proposal](https://github.com/WebAssembly/wasi-cli).

```shell
$ /opt/cheerp/bin/clang -target cheerp-wasm-wasi example.c
$ wasmtime a.out a b c
```

### Other

When targeting something else, you can provide environment variables and program arguments by defining a global variable called `CHEERP_ARGV`.

For example:

```js
globalThis.CHEERP_ARGV = ["a", "b", "c"];
```

## Limitations

It is not possible to receive arguments in `main` when the `main` function is in a different section than the target.

## Comparison to `webMain`

`webMain` cannot take arguments. To take arguments, use `main`.
