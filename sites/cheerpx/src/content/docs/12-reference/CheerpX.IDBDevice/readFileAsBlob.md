---
title: readFileAsBlob
description: Reads a file from an IDBDevice and returns it as a Javascript Blob object.
---

```js
namespace CheerpX {
  class IDBDevice {
    async readFileAsBlob(filename: string): Promise<Blob>;
  }
}
```

## Parameters

- **filename (`string`)** - The path to the file within the `IDBDevice`, starting with a `/` (e.g., “/filename”). Do not include the mount point.

## Returns

`CheerpX.IDBDevice.readFileAsBlob` returns a [Promise] that resolves to a Javascript `Blob` object. This object represents the file's data, which can be further manipulated or converted as needed.

## Example

```js

```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
