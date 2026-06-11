---
title: read
description: Read data from the file
---

```ts
class BinaryFile {
	async read(length: int): Promise<ArrayBuffer>;
}
```

## Parameters

- **length (`int`)** - Lenght in bytes of the data to be read.

## Returns

`read` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to an `ArrayBuffer` containing the data that was read. On success the seek position is updated. If there is an error during the read, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
