---
title: onOpen
description: Set up a callback that will be invoked when a file or URL is opened in the pod
---

```ts
class BrowserPod {
	onOpen(cb: (path: string) => void): void;
}
```

## Parameters

- **cb** (`function(urlOrpath: string) => void`) - Callback function to invoke when a file or URL is opened within the [Pod].

## Callback arguments

- **urlOrpath (`string`)** - The absolute path to the file, or URL, that was opened within the [Pod].

## Returns

`onOpen` does not return a value.

## Notes

`onOpen` intercepts the use of the [`xdg-open`](https://linux.die.net/man/1/xdg-open) utility.

[Pod]: /docs/reference/browserpod/
