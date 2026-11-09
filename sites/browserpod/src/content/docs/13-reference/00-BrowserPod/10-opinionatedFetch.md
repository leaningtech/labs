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

A preconfigured fetch handler for [`createFetchNetwork`](/docs/reference/BrowserPod/createFetchNetwork).

Because a fetch network runs directly in the browser, requests are subject to CORS restrictions. `opinionatedFetch` automatically rewrites and adapts requests for supported external services so they work without manual proxy setup. Unmatched requests are forwarded unchanged to `init.defaultFetch`.

Currently, `opinionatedFetch` enables commands like `npm install` to download packages from the npm registry. Support for additional services will be added in future releases.

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
