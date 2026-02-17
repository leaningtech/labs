---
title: write
description: Write data into the file
---

```ts
class TextFile {
	async write(data: string): Promise<int>;
}
```

## Parameters

- **data (`string`)** - String to write into the file at the current seek position. The string is decoded to utf-8.

## Returns

`write` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to the number of bytes actually written. On success the seek position is updated. If there is an error during the write, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
