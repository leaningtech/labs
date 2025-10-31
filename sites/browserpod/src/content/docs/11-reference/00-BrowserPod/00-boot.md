---
title: boot
description: Initialize a pod instance
---

```ts
class BrowserPod {
	static async boot(opts: {
		nodeVersion?: string;
		apiKey: string;
	}): Promise<BrowserPod>;
}
```

## Parameters

- **opts** (object) - Initialization options passed as an object

## Options

- **nodeVersion (`string`, _optional_)** - The version of node to use. Currently only "22" is allowed.
- **apiKey (`string`)** - The API key to use.

## Returns

`boot` returns a [Promise] which is resolved when the Pod is ready to be used. It returns the newly created Pod.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

## Notes

Calling this method deducts 10 tokens from your BrowserPod account balance.
It will fail if not enough tokens are available.
