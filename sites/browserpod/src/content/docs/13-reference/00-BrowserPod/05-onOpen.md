---
title: onOpen
description: Set up a callback that will be invoked when a file or resource is opened in the pod
---

```ts
class BrowserPod {
	onOpen(cb: (path: string) => void): void;
}
```

## Parameters

- **cb** (`function(path: string) => void`) - Callback function to invoke when a file or resource is opened within the pod.

## Callback arguments

- **path (`string`)** - The absolute path to the opened file or resource within the pod's filesystem.

## Returns

`onOpen` does not return a value.
