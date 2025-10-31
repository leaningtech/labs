---
title: write
description: Write data into the file
---

```ts
class BinaryFile {
	async write(data: ArrayBuffer): Promise<int>;
}
```

## Parameters

- **data** (`ArrayBuffer`) - Data to write into the file at the current seek position.

## Returns

`write` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to the number of bytes actually written. On success the seek position is updated. If there is an error during the write, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
