---
title: cjGetRuntimeResources
---

| **Parameters** | **Type** |
| -------------- | -------- |
| None           |          |
| **Returns**    | string   |

Returns a JavaScript string representing the data that should be passed to [preloadResources](#preloadResources). Once parsed, it is an object containing the filenames that have been loaded from the runtime up to the time this function is called.

Output example:

```js
'{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}';
```
