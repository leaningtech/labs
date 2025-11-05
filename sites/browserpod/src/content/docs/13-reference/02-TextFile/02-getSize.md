---
title: getSize
description: Get the file size
---

```ts
class TextFile {
	async getSize(): Promise<int>;
}
```

## Returns

`getSize` returns a [Promise] which is resolved when the operation has succeded.
The promise resolves to the byte size of the file.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
