---
title: createDirectory
description: Create a directory in the Pod's filesystem
---

```ts
class BrowserPod {
	async createDirectory(
		path: string,
		opts?: { recursive?: boolean }
	): Promise<void>;
}
```

## Parameters

- **path (`string`)** - Path of the newly-created directory.
- **opts (`object`, _*optional*_)** - Creation options passed as an object.

## Options

- **recursive (`boolean`, _optional_)** - Wether missing intermediate directory should be created or not.

## Returns

`createDirectory` returns a [Promise] which is resolved when the operation has succeded. If the directory could not be created, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
