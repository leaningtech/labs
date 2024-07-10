---
title: cjFileBlob
description: Read a file from the virtual filesystem
---

Used to read files from the CheerpJ virtual filesystem.

```ts
async function cjFileBlob(path: string): Promise<Blob>;
```

## Parameters

- **path (`string`)** - The path to the file to be read. Must begin with `/files/`, `/app/` or `/str/`.

## Returns

`cjFileBlob` returns a [Promise] which resolves to a [Blob] of the file contents.

## Examples

### Read a text file

```js
const blob = await cjFileBlob("/files/file1.txt");
const text = await blob.text();
console.log(text);
```

### Read a binary file

```js
const blob = await cjFileBlob("/files/file2.bin");
const data = new Uint8Array(await blob.arrayBuffer());
console.log(data);
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Blob]: https://developer.mozilla.org/en-US/docs/Web/API/Blob
