---
title: cjFileBlob
---

Used to download files from the CheerpJ filesystem. It returns a promise that eventually resolve to a Blob object, which can be downloaded with standard HTML5 techniques.

```ts
async function cjFileBlob(fileName: string): Promise<Blob>;
```

## Parameters

- **fileName (`string`)** - The name of the file to be downloaded

## Returns

- **`Promise\<Blob>`**

## Example

```js
const myBlob = await cjFileBlob("/files/file1.txt");
const objectURL = URL.createObjectURL(myBlob);
// do something else
```

> [!note] Important
> Remember to use the `/files/` prefix to refer to the CheerpJ filesystem mountpoint
