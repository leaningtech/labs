---
title: createFile
description: "Create a new file in a BrowserPod Pod's virtual filesystem, returning a BinaryFile or TextFile handle depending on the mode you pass."
---

```ts
class BrowserPod {
	async createFile(path: string, mode: "binary"): Promise<BinaryFile>;
	async createFile(path: string, mode: "utf-8"): Promise<TextFile>;
}
```

## Parameters

- **path (`string`)** - Path of the newly-created file.
- **mode (`"binary" | "utf-8"`)** - Opening mode.

## Returns

`createFile` returns a [Promise] which resolves to a [BinaryFile] object if `mode="binary"`, and to a [TextFile] object if `mode="utf-8"`.
If the file could not be created, the [Promise] will be rejected.

> [!warning]
> Calling `createFile` on an already existing file will wipe its contents.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[BinaryFile]: /docs/reference/BinaryFile
[TextFile]: /docs/reference/TextFile
