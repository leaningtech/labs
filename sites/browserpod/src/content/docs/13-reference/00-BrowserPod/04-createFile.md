---
title: createFile
description: Create a file in the Pod's filesystem
---

```ts
class BrowserPod {
	async createFile(path: string, mode: string): Promise<BinaryFile | TextFile>;
}
```

## Parameters

- **path (`string`)** - Path of the newly-created file.
- **mode (`string`)** - Opening mode. Either "binary" or "utf-8".

## Returns

`createFile` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to a `BinaryFile` object if `mode="binary"`, and to a `TextFile` object if `mode="utf-8"`. If the file could not be created, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
