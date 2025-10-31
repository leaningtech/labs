---
title: openFile
description: Open a file in the Pod's filesystem
---


```ts
class BrowserPod {
  async openFile(path: string): Promise<FileHandle>;
}
```

## Parameters

- **path** (`string`) - Path to an existing file

## Returns

`openFile` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to a FileHandle object representing the existing file. If the file does not exist, the [Promise] will be rejected.


[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
