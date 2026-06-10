---
title: boot
description: Initialize a pod instance
---

```ts
class BrowserPod {
	static async boot(opts: {
		apiKey: string;
		nodeVersion?: string;
		storageKey?: string;
		userImage?: string;
	}): Promise<BrowserPod>;
}
```

## Parameters

- **opts (object)** - Initialization options passed as an object.

## Options

- **apiKey (`string`)** - The API key to use.
- **nodeVersion (`string`, _optional_)** - The version of Node.js to use. Currently only "22" is allowed.
- **storageKey (`string`, _optional_)** - An arbitrary string identifying the pod's persistent storage. _When omitted, the pod is **ephemeral**_: it boots a fresh disk each time and nothing is saved between sessions. _When provided, the filesystem persists_. Rebooting with the same key resumes the same disk.
- **userImage (`string`, _optional_)** - A URL pointing to a custom ext2 filesystem image that will be mounted directly on the `/home` directory of the pod's filesystem.

## Returns

`boot` returns a [Promise] which is resolved when the [Pod] is ready to be used. It returns the newly created [Pod].

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Pod]: /docs/reference/browserpod/

## Notes

Calling this method deducts 10 tokens from your BrowserPod account balance.
It will fail if not enough tokens are available.
