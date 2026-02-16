---
title: Common errors
description: Quick explanations for frequent BrowserPod errors
---


This page maps common BrowserPod error messages to their likely causes and fixes.


## Treating `pod.run` like a shell

**Symptom**

- errors when using `&&` or `|` inside `pod.run(...)`

**Cause**

`pod.run` is like `execve` in Linux or `child_process.spawn` in Node.
It does not support shell features like `||` or `&&` or builtins.

Bash support is on the roadmap.

**Fix**

Write complex behavior as a JavaScript script, and execute that

## Missing or hidden terminal element

**Symptom**

- `The 'terminal' argument is required`
- Output disappears during long runs

**Cause**

The terminal element was never created or was unmounted.

**Fix**

```js
const terminal = await pod.createDefaultTerminal(consoleEl);
...
pod.run(..., {terminal,...});
```

Keep `consoleEl` mounted. You can hide it with CSS, but do not remove it.

## Using the wrong file mode

**Symptom**

- `Unsupported 'mode' argument`

**Cause**

`createFile` and `openFile` only accept `"binary"` or `"utf-8"`.

**Fix**

Use `"binary"` for ArrayBuffer writes and `"utf-8"` for string writes.

## Running native binaries inside the pod

**Symptom**

- Install failures or runtime crashes for tools like esbuild or rollup

**Cause**

Native binaries do not run in the Wasm environment.

**Fix**

Use Wasm alternatives and `package.json` overrides. See the
[native binaries guide](/docs/guides/native-binaries).

