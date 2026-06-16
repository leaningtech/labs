---
title: getSize
description: Get the size in bytes of a TextFile stored in a BrowserPod Pod's virtual filesystem, returned as a promise.
---

```ts
class TextFile {
	async getSize(): Promise<int>;
}
```

## Parameters

`getSize` does not have any parameters.

## Returns

`getSize` returns a [Promise] which is resolved when the operation has succeded.
The promise resolves to the byte size of the file.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
