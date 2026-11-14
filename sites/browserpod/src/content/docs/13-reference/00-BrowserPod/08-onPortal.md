---
title: onPortal
description: Set up a callback that will be invoked when a Portal is created
---

```ts
class BrowserPod {
	onPortal(cb: ({ url: string, port: number }) => void): void;
}
```

## Parameters

- **cb** (`function({url: string, port: number}) => void`) - Function to invoke each time a [Portal](/docs/understanding-browserpod/portals) is created, once per listening port.

## Callback arguments

- **url (`string`)** - The URL at which the Portal is accessible.
- **port (`number`)** - The port inside the Pod that the server is listening on.

## Returns

`onPortal` does not return a value.

> [!note]
> Portals are only created on the [edge network](/docs/understanding-browserpod/networking), which requires an [API key](/docs/understanding-browserpod/api-key).
