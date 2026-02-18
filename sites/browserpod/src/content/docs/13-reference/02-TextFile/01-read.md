---
title: read
description: Read data from the file
---

```ts
class TextFile {
	async read(length: int): Promise<string>;
}
```

## Parameters

- **length (`int`)** - Lenght in bytes of the data to be read and decoded as utf-8 into a string.

## Returns

`read` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to a string representing the data decoded as utf-8. On success the seek position is updated. If there is an error during the read, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
