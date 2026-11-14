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

Creates a fetch network instance that routes the Pod's HTTP, HTTPS, and WebSocket traffic directly through the browser using [`fetch()`][fetch]. It requires no API key and costs no tokens. `BrowserPod.boot` without an `apiKey` uses this network with the browser's default `fetch()`.

Because requests run inside the browser, they are subject to Cross-Origin Resource Sharing (CORS) restrictions and can only reach servers that allow cross-origin requests. See [Networking](/docs/understanding-browserpod/networking) for an overview.

## Parameters

- **opts (`object`, _optional_)** - Configuration options.

## Options

- **fetch (`function`, _optional_)** - A custom fetch function to handle outgoing requests. Defaults to the browser's global [`fetch()`][fetch]. The custom handler receives the browser's default implementation as `init.defaultFetch`, allowing you to inspect, modify, or proxy requests.

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

### Custom fetch handler

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
const pod = await BrowserPod.boot({ network });
```

### WebSocket connections

A fetch network carries outgoing WebSocket connections as well as HTTP and HTTPS. The default handler and [`opinionatedFetch`](/docs/reference/BrowserPod/opinionatedFetch) open them for you, and so does any custom handler that forwards the request to `init.defaultFetch`.

Handling the upgrade yourself is an advanced case: return a `101` response that carries the socket on a `webSocket` property, the same contract [Cloudflare Workers][cf-websockets] use.

```js
const network = await BrowserPod.createFetchNetwork({
	fetch(url, init) {
		if (init.headers?.get("upgrade") !== "websocket") {
			return init.defaultFetch(url, init);
		}
		// Open the socket yourself, then hand its client end back to the Pod.
		return new Response(null, {
			status: 101,
			webSocket,
		});
	},
});
const pod = await BrowserPod.boot({ network });
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
[cf-websockets]: https://developers.cloudflare.com/workers/examples/websockets/
