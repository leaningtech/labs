---
title: cheerpjAddStringFile
---

Used to add files into the `/str/` mount point filesystem.

```ts
function cheerpjAddStringFile(name: string, str: string): void;
```

## Parameters

- **fileName (`string`)** - Name of the file to be added.
- **str (`string`)** - Text in a JavaScript string.

## Returns

- **`void`**

## Example

```js
cheerpjAddStringFile("/str/fileName.txt", "Some text in a JS String");
```
