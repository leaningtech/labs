---
title: Debugging BrowserPod
description: Quick explanations for frequent BrowserPod errors
---

This page maps common BrowserPod error messages to their likely causes and fixes.

## Treating `pod.run` like a shell

- **Symptom**: errors when using `&&` or `|` inside `pod.run(...)`

- **Cause**: `pod.run` is like `execve` in Linux or `child_process.spawn` in Node. It does not support shell features like `||` or `&&` or builtins directly.

- **Solution**: Write complex behavior as a JavaScript script, and execute that.

## Missing or hidden terminal element

- **Symptoms**:
  - `The 'terminal' argument is required`
  - Output disappears during long runs

- **Cause**: The terminal element was never created or was unmounted.

- **Solution**: Keep `consoleEl` mounted. You can hide it with CSS, but do not remove it.

```js
const terminal = await pod.createDefaultTerminal(consoleEl);
...
pod.run(..., {terminal,...});
```

## Using the wrong file mode

- **Symptom**: `Unsupported 'mode' argument`

- **Cause**: `createFile` and `openFile` only accept `"binary"` or `"utf-8"`.

- **Solution**: Use `"binary"` for ArrayBuffer writes and `"utf-8"` for string writes.

## Running native binaries inside the Pod

- **Symptom**: Install failures or runtime crashes for tools like esbuild or rollup

- **Cause**: Prebuilt binaries from npm packages are compiled for your host CPU architecture, not Wasm, so they don't run in the Pod.

- **Solution**: Use Wasm alternatives and `package.json` overrides. See the
  [native npm dependencies guide](/docs/guides/Working-around-native-npm-dependencies). If you're compiling your own program rather than relying on a prebuilt package, see [Installing the Rust toolchain](/docs/guides/installing-rust-toolchain) for how to target BrowserPod directly.
