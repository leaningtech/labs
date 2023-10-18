---
title: cheerpjAddStringFile
description: Write a file into the virtual filesystem
---

Used to write files into the `/str/` filesystem. If the file already exists, it will be overwritten.

```ts
function cheerpjAddStringFile(path: string, data: string | Uint8Array): void;
```

## Parameters

- **path (`string`)** - The path to the file to overwrite. Must begin with `/str/`.
- **data (`string` or `Uint8Array`)** - File contents, as text or binary data.

## Returns

`cheerpjAddStringFile` does not return a value.

## Example

```js
cheerpjAddStringFile("/str/fileName.txt", "Some text in a JS String");
```
