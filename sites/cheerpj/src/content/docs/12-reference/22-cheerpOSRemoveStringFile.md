---
title: cheerpOSRemoveStringFile
description: Remove a file from the virtual filesystem
---

Used to remove files from the `/str/` filesystem. If the file does not exist, it returns without doing anything.

```ts
function cheerpOSRemoveStringFile(path: string): void;
```

## Parameters

- **path (`string`)** - The path to the file to remove. Must begin with `/str/`.

## Returns

`cheerpOSRemoveStringFile` does not return a value.

## Example

```js
cheerpOSRemoveStringFile("/str/fileName.txt");
```
