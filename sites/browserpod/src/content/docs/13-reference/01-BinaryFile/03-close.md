---
title: close
description: "Close a BinaryFile handle in a BrowserPod Pod to flush pending writes and release the file once you have finished reading or writing."
---

```ts
class BinaryFile {
	async close(): Promise<void>;
}
```

## Parameters

`close` does not have any parameters.

## Returns

`close` returns a [Promise] which is resolved when the operation has succeeded.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
