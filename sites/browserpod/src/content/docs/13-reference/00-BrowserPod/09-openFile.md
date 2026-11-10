---
title: openFile
description: "Open an existing file in a BrowserPod Pod's virtual filesystem, returning a BinaryFile or TextFile handle depending on the mode you pass."
---

```ts
class BrowserPod {
	async openFile(path: string, mode: "binary"): Promise<BinaryFile>;
	async openFile(path: string, mode: "utf-8"): Promise<TextFile>;
}
```

## Parameters

- **path (`string`)** - Path to an existing file.
- **mode (`"binary" | "utf-8"`)** - Opening mode.

## Returns

`openFile` returns a [Promise] which resolves to a [BinaryFile] object if `mode="binary"`, and to a [TextFile] object if `mode="utf-8"`. If the file does not exist, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[BinaryFile]: /docs/reference/BinaryFile
[TextFile]: /docs/reference/TextFile
