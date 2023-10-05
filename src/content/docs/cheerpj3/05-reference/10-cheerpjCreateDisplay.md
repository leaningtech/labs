---
title: cheerpjCreateDisplay
---

This method will create the HTML element that will contain all Java windows. It is only required to run graphical applications.

| **Parameters**    | **Type**    |
| ----------------- | ----------- |
| width             | number      |
| height            | number      |
| parent (optional) | HTMLElement |
| **Returns**       | HTMLElement |

```js
cheerpjCreateDisplay(width, height, /*optional*/ parent);
```

The `width` and `height` parameter represent the display area size in CSS pixels. It is also possible to specify a parent element if required, if a parent element is not specified the display area will be appended to the page `body` element. If a parent is specified it is also possible to pass `-1` to both `width` and `height`, in that case the size will correspond to the parent size and it will also change dynamically if the parent is modified by either CSS changes or browser window resize.

## Running applications and `.jar`(s)

**Warning**: CheerpJ does not support opening the HTML pages directly from disk. If the URL in your browser starts with `file://`, CheerpJ will not run. You _must_ use a local Web server.
