---
title: read
description: "Read text from a TextFile in a BrowserPod Pod, returning the requested length of data as a decoded string."
---

```ts
class TextFile {
	async read(length: int): Promise<string>;
}
```

## Parameters

- **length (`int`)** - Length in bytes of the data to be read and decoded as utf-8 into a string.

## Returns

`read` returns a [Promise] which is resolved when the operation has succeeded. The promise resolves to a string representing the data decoded as utf-8. On success the seek position is updated. If there is an error during the read, the [Promise] will be rejected.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
