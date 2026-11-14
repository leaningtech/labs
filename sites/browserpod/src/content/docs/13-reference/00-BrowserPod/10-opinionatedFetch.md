---
title: opinionatedFetch
description: A preconfigured fetch handler that enables access to developer services like the npm registry on a fetch network.
---

```ts
class BrowserPod {
	static opinionatedFetch(
		url: string,
		init: RequestInit & { defaultFetch: typeof fetch }
	): Promise<Response>;
}
```

A preconfigured fetch handler for [`createFetchNetwork`](/docs/reference/BrowserPod/createFetchNetwork). `BrowserPod.boot` doesn't use it by default; pass it to `createFetchNetwork` as in the [Example](#example).

On a fetch network, requests are subject to CORS restrictions. `opinionatedFetch` adapts requests to known services, such as the npm registry, so the browser can send them, which lets commands like `npm install` work. Other requests go to `init.defaultFetch` unchanged. Support for more services is planned.

## Parameters

- **url (`string`)** - The resource URL being requested.
- **init (`object`)** - Standard [`RequestInit`][RequestInit] options extended with `defaultFetch`, which provides access to the browser's default `fetch` implementation.

## Returns

A [Promise] that resolves to a [`Response`][Response] object.

## Example

```js
const network = await BrowserPod.createFetchNetwork({
	fetch: BrowserPod.opinionatedFetch,
});
const pod = await BrowserPod.boot({ network });
```

### Combining with a custom fetch handler

To add custom request logic alongside `opinionatedFetch`, call it from within your own `fetch` function:

```js
const network = await BrowserPod.createFetchNetwork({
	fetch(url, init) {
		// Custom handling or adjustments here
		return BrowserPod.opinionatedFetch(url, init);
	},
});
const pod = await BrowserPod.boot({ network });
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Response]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[RequestInit]: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#options
