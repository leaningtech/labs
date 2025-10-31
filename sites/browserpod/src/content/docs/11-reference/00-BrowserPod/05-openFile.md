---
title: openFile
description: Open a file in the Pod's filesystem
---

```ts
class BrowserPod {
	async openFile(path: string, mode: string): Promise<BinaryFile | TextFile>;
}
```

## Parameters

- **path** (`string`) - Path to an existing file
- **mode** (`string`) - Opening mode. Either "binary" or "utf-8"

## Returns

`openFile` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to a `BinaryFile` object if `mode="binary"`, and to a `TextFile` object if `mode="utf-8"`. If the file does not exist, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
