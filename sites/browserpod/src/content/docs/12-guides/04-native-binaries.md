---
title: Running native binaries
description: Using packages with native components in BrowserPod
---
BrowserPod runs Node.js in a Wasm environment. Packages that ship native binaries for specific CPU architectures will not run in this environment unless they provide a Wasm build.

## Strategy

If a package has a Wasm-compatible alternative, you can use `overrides` in `package.json` to force npm to install the Wasm version.

## esbuild

```json
{
  "overrides": {
    "esbuild": "npm:esbuild-wasm@*"
  }
}
```

## rollup

```json
{
  "overrides": {
    "rollup": "npm:@rollup/wasm-node@*"
  }
}
```

If a package does not offer a Wasm build, it will not work inside BrowserPod. In that case, choose an alternative package or run the tool outside the pod.

