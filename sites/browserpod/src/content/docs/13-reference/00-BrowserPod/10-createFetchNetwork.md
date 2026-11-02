---
title: createFetchNetwork
description: Create a fetch network that connects a Pod to the internet using the browser's fetch() API.
---

```ts
class BrowserPod {
	static async createFetchNetwork(opts?: {
		fetch?: (
			url: string,
			init: RequestInit & { defaultFetch: typeof fetch }
		) => Promise<Response>;
	}): Promise<PodNetwork>;
}
```

Creates a fetch network instance that routes the Pod's HTTP and HTTPS requests directly through the browser using [`fetch()`][fetch]. It requires no API key and costs no tokens.

Because requests run inside the browser, they are subject to Cross-Origin Resource Sharing (CORS) restrictions and can only reach servers that allow cross-origin requests. See [Networking](/docs/understanding-browserpod/networking) for an overview.

## Parameters

- **opts (`object`, _optional_)** - Configuration options.

## Options

- **fetch (`function`, _optional_)** - A custom fetch function to handle outgoing requests. Defaults to the browser's global [`fetch`]. The custom handler receives the browser's default implementation as `init.defaultFetch`, allowing you to inspect, modify, or proxy requests.

## Returns

A [Promise] that resolves to a `PodNetwork` instance. Pass it to [`BrowserPod.boot`](/docs/reference/BrowserPod/boot) as the `network` option.

## Example

To enable `npm install` from the npm registry, pass [`BrowserPod.opinionatedFetch`](/docs/reference/BrowserPod/opinionatedFetch):

```js
const network = await BrowserPod.createFetchNetwork({
	fetch: BrowserPod.opinionatedFetch,
});
const pod = await BrowserPod.boot({ network });
```

## Custom fetch handler

To modify requests or route them through your own proxy, adjust the request parameters and forward them to `init.defaultFetch`:

```js
const network = await BrowserPod.createFetchNetwork({
	fetch(url, init) {
		if (new URL(url).hostname === "api.example.com") {
			url = "https://proxy.example.com/" + url;
		}
		return init.defaultFetch(url, init);
	},
});
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
