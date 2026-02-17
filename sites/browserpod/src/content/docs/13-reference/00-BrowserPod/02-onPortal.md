---
title: onPortal
description: Set up a callback that will be invoked when a Portal is created
---

```ts
class BrowserPod {
	onPortal(cb: ({ url: string, port: int }) => void): void;
}
```

## Parameters

- **cb** (`function({url: string, port: int}) => void`) - Function to invoke when a Portal is created.

## Callback arguments

- **url (`string`)** - The URL at which the Portal is accessible.
- **port (`number`)** - The local port that is connected to the Portal.

## Returns
`onPortal` does not return a value.
