---
title: Networking
description: How networking works in BrowserPod, and the differences between edge and fetch networks.
---

A [Pod](/docs/reference/BrowserPod) connects to the internet using one of two network types:

- **Edge network:** Routes network traffic through BrowserPod's edge proxy servers. This requires an [API key](/docs/understanding-browserpod/api-key) and deducts tokens, but allows outgoing connections to any domain allowed by your key and enables public access to servers via [Portals](/docs/understanding-browserpod/portals).
- **Fetch network:** Routes network traffic directly through the browser using the standard [`fetch()`][fetch] API. This requires no API key and costs no tokens, but traffic is subject to browser security restrictions.

## Choosing a network

By default, [`BrowserPod.boot`](/docs/reference/BrowserPod/boot) selects the network based on whether an `apiKey` is provided:

```js
// Edge network: pass an API key
const pod = await BrowserPod.boot({ apiKey: "your_key_here" });

// Fetch network: omit the API key
const pod = await BrowserPod.boot({});
```

To customize network settings, create a network object with [`createEdgeNetwork`](/docs/reference/BrowserPod/createEdgeNetwork) or [`createFetchNetwork`](/docs/reference/BrowserPod/createFetchNetwork) and pass it to `boot`:

```js
const network = await BrowserPod.createFetchNetwork({
	fetch: BrowserPod.opinionatedFetch,
});
const pod = await BrowserPod.boot({ network });
```

## Comparison

| Feature                                               | Edge network                      | Fetch network               |
| ----------------------------------------------------- | --------------------------------- | --------------------------- |
| **API key**                                           | Required                          | Not required                |
| **Token cost**                                        | 10 tokens per boot                | Free (0 tokens)             |
| **Outgoing HTTP, HTTPS, WebSockets**                  | To any domain allowed by your key | To origins that permit CORS |
| **[Portals](/docs/understanding-browserpod/portals)** | Supported                         | Not supported               |

## Fetch network and CORS

Because requests on the fetch network originate directly from the browser, they are subject to standard **Cross-Origin Resource Sharing (CORS)** rules. Servers must return CORS headers allowing requests from your web page's origin; otherwise, the browser blocks the connection.

BrowserPod provides two ways to work around CORS limitations on a fetch network:

- **[`opinionatedFetch`](/docs/reference/BrowserPod/opinionatedFetch):** A built-in fetch handler that applies workarounds for known developer services, such as the npm registry (enabling `npm install` to work out of the box).
- **Custom `fetch` function:** Pass a custom function to [`createFetchNetwork`](/docs/reference/BrowserPod/createFetchNetwork) to route requests through your own reverse proxy.

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
