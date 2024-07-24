---
title: Address Sanitizer
description: "`-fsanitize=address` support"
---

[Address Sanitizer](https://github.com/google/sanitizers/wiki/AddressSanitizer) (ASan) is a memory error detector capable of finding common programming errors such as:

- Use after free
- Heap buffer overflow
- Stack buffer overflow
- Global buffer overflow
- Use after return
- Use after scope
- Initialization order bugs
- Memory leaks

Address Sanitizer for Cheerp is supported for both Wasm and AsmJS.

## Prerequisites

Currently, ASan is only supported on the nightly version of the Cheerp toolchain, stable will **_not_** work.

## Example

Let's start with a simple example. Consider the following C code:

```c
int main() {
  int *p = 0;
  return *p;
}
```

When compiled and executed normally with Cheerp it will not indicate some kind of error like it might do on native.
But if we compile with the flag `-fsanitize=address` and run it like this:

```
$ /opt/cheerp/bin/clang -fsanitize=address -cheerp-pretty-code test.c
$ node a.out
=================================================================
==1==ERROR: AddressSanitizer: unknown-crash on address 0x00000000 at pc 0x000192b6 bp 0x00000000 sp 0x00100ffc
READ of size 4 at 0x00000000 thread T0
    #0 0x192b6 in main (main+0x192b6)
    #1 0x1f2c3 in _start (main+0x1f2c3)
    #2 0x80000145 in <unknown function> main:325

Address 0x00000000 is a wild pointer inside of access range of size 0x00000004.
SUMMARY: AddressSanitizer: unknown-crash (main+0x192b6) in main
Shadow bytes around the buggy address:
=>0x00000000:[fe]fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe
  0x00000080: fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe
  0x00000100: fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe
  0x00000180: fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe
  0x00000200: fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe
  0x00000280: fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe fe
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==1==ABORTING
```

This time when we execute it we are greeted by a large error report telling us that we tried to read 4 bytes from an address we don't own.

## Two step compilation

If you perform compilation and linking separately, you'll have to specify the `-fsanitize=address` flag both during linking and compilation.

## Specifying runtime flags

When compiling with address sanitizer, you'll be able to specify environment variables through the `CHEERP_ENV` JavaScript global, which is an array of string key,value pairs. To get a list of all available ASan options add the following to the top of your generated JavaScript file:

```js
const CHEERP_ENV = ["ASAN_OPTIONS=help=1"];
```

You can separate flags with `:` like this:

```js
const CHEERP_ENV = ["ASAN_OPTIONS=option1=a:option2=b"];
```

## Tips

### The sanitized version is so slow!

Slowdowns are expected when running the sanitized version, however if your codebase or the libraries it uses makes
heavy use of `malloc` and/or `free` you might be able to speed it up by specifying the following flag:

```
disables_traces=1
```

As the name implies, you'll no longer have stack traces in the ASan reports, but this might speed up your code significantly, as every time `malloc` or `free` is called, it saves the stack trace to be used in the reports.

### Checking for leaks

ASan comes with LeakSanitizer (LSan), which is triggered upon exit of the program. For Cheerp you'll have to
explicitly call `exit(3)` or something similar which calls the onexit hooks for it to trigger. Be warned though, LSan is not perfect.

### Partial instrumentation

The way that ASan works is basically by inserting a check before every load/store, calling a report function if the
program wasn't allowed to do it. This means that it's OK to have uninstrumented code mixed with instrumented code.
However, it won't be able to detect memory errors in the uninstrumented code. This is basically what happens with the standard libraries, which are not sanitized, but only a few commonly used functions being intercepted (`memcpy`, `memset`, etc.).

You can also disable instrumentation for a specific functions by giving it the following attribute:

```cpp
__attribute__((no_sanitize("address")))
```

## Further reading

If you want to learn more about AddressSanitizer and its features:
https://github.com/google/sanitizers/wiki/AddressSanitizer
