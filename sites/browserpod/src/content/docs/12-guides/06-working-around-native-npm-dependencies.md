---
title: Working around native npm dependencies
description: Using npm packages with native components in BrowserPod
---

BrowserPod runs Node.js in a Wasm environment. Packages that ship native binaries for specific CPU architectures will not run in this environment unless they provide a Wasm build.

This guide walks you through spotting native-dependency issues and fixing them. You can either swap in a Wasm-compatible package via `overrides`, or run the incompatible tool outside BrowserPod.

## Strategy: Using Wasm-compatible alternatives

If a package has a Wasm-compatible alternative, you can use `overrides` in `package.json` to force npm to install the Wasm version.

### Example: esbuild and rollup

`esbuild` has `esbuild-wasm`, and `rollup` has `@rollup/wasm-node`. Override both the same way:

```json
{
	"overrides": {
		"esbuild": "npm:esbuild-wasm@*",
		"rollup": "npm:@rollup/wasm-node@*"
	}
}
```

This forces npm to replace the default packages with the Wasm-compatible versions, ensuring that the build works inside BrowserPod without relying on native CPU binaries.

### Verifying the override worked

To confirm it worked, run:

```bash
npm ls <package name>
```

It should now resolve to the Wasm-compatible package, and installing or building inside a Pod should no longer throw the native-binary error.

## When no Wasm build exists

If a package does not offer a Wasm build, it will not work inside BrowserPod. In that case, you have two options:

1. Look for a different package with similar functionality that has a Wasm build. For example, you could swap `sharp` (native image processing) for a pure-JS/Wasm alternative like `jimp`.

2. Run the original tool outside BrowserPod in a normal Node.js environment.
