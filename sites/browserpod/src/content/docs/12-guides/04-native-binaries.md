---
title: Running native binaries
description: Using packages with native components in BrowserPod
---

BrowserPod runs Node.js in a Wasm environment. Packages that ship native binaries for specific CPU architectures will not run in this environment unless they provide a Wasm build.

## Strategy: Using Wasm-compatible alternatives

If a package has a Wasm-compatible alternative, you can use `overrides` in `package.json` to force npm to install the Wasm version.

### Example: esbuild
To use the Wasm version of `esbuild`:

```json
{
	"overrides": {
		"esbuild": "npm:esbuild-wasm@*"
	}
}
```
This forces npm to replace the default `esbuild` package (which contains native binaries) with the Wasm-compatible version.

### Example: rollup
Similarly, for `rollup`:
```json
{
	"overrides": {
		"rollup": "npm:@rollup/wasm-node@*"
	}
}
```
This ensures that the build works inside BrowserPod without relying on native CPU binaries.

## When no Wasm build exists
If a package does not offer a Wasm build, it will not work inside BrowserPod. In that case, you have two options:

1. Look for a different package that offers similar functionality and has a Wasm build.

2. Run the original tool outside of BrowserPod in a normal Node.js environment.
