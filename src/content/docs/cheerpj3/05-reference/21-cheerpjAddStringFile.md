---
title: cheerpjAddStringFile
---

`cheerpjAddStringFile(fileName, str)`

| **Parameters** | **Type** |
| -------------- | -------- |
| fileName       | string   |
| text           | string   |
| **Returns**    | void     |

Used to add files into the `/str/` mount point filesystem.

Example:

```js
cheerpjAddStringFile("/str/fileName.txt", "Some text in a JS String");
```
