---
title: cjGetProguardConfiguration
description: Download a ProGuard configuration file
---

Triggers download of a configuration file which can be used to tree-shake JARs using [ProGuard].

```ts
function cjGetProguardConfiguration(): void;
```

> [!note] Note
> This function is intended for use in the browser console. It is not intended to be called from within your application.

## Parameters

`cjGetProguardConfiguration` does not take any parameters.

## Returns

`cjGetProguardConfiguration` does not return a value. It triggers a download of a `cheerpj.pro` file.

## Example

On the browser console type:

```shell
cjGetProguardConfiguration();
```

This will trigger the download of `cheerpj.pro` file.

[ProGuard]: https://github.com/Guardsquare/proguard
