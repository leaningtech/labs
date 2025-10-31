---
title: createFile
description: Create a file in the Pod's filesystem
---


```ts
class BrowserPod {
  async createFile(path: string): Promise<FileHandle>;
}
```

## Parameters

- **path** (`string`) - Path of the newly-created file

## Returns

`createFile` returns a [Promise] which is resolved when the operation has succeded. The promise resolves to a FileHandle object representing the newly-created file. If the file could not be created, the [Promise] will be rejected.


[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
