---
title: boot
description: "Boot a BrowserPod Pod to start an isolated, in-browser Linux runtime, optionally persisting its filesystem with a storageKey."
---

```ts
class BrowserPod {
	static async boot(opts: {
		apiKey?: string;
		network?: PodNetwork;
		nodeVersion?: string;
		storageKey?: string;
		userImage?: string;
	}): Promise<BrowserPod>;
}
```

## Parameters

- **opts (object)** - Initialization options passed as an object.

## Options

- **apiKey (`string`, _optional_)** - The [API key](/docs/understanding-browserpod/api-key) used to connect the Pod to an [edge network](/docs/understanding-browserpod/networking).
  - _Omitted_ → The Pod boots on a free [fetch network](/docs/understanding-browserpod/networking), routing requests directly through the browser.
- **network (`PodNetwork`, _optional_)** - A preconfigured network instance created with [`createEdgeNetwork`](/docs/reference/BrowserPod/createEdgeNetwork) or [`createFetchNetwork`](/docs/reference/BrowserPod/createFetchNetwork). Cannot be combined with `apiKey`.
- **nodeVersion (`string`, _optional_)** - The version of Node.js to use. Currently only "22" is allowed.
- **storageKey (`string`, _optional_)** - Identifies the Pod's persistent storage.
  - _Omitted_ → ephemeral: fresh disk each boot, nothing is saved between sessions.
  - _Provided_ → persistent: the same key resumes the same disk, a different key starts a separate one.
- **userImage (`string`, _optional_)** - A URL pointing to a custom ext2 filesystem image that will be mounted directly on the `/home` directory of the Pod's filesystem. If you change the image, also change the `storageKey` if provided.

## Returns

`boot` returns a [Promise] which is resolved when the [Pod] is ready to be used. It returns the newly created [Pod].

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Pod]: /docs/reference/BrowserPod

## Notes

- Booting on an edge network deducts 10 tokens from your BrowserPod account balance (and fails if insufficient tokens are available). Booting on a fetch network is free and deducts no tokens.
- For how the Pod's filesystem is structured and when its data persists, see [Filesystem](/docs/understanding-browserpod/filesystem).
