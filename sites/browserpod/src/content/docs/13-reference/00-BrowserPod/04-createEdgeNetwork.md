---
title: createEdgeNetwork
description: Create an edge network that routes a Pod's traffic through BrowserPod's edge servers using an API key.
---

```ts
class BrowserPod {
	static async createEdgeNetwork(opts: { apiKey: string }): Promise<PodNetwork>;
}
```

Creates an edge network instance that routes the Pod's outbound HTTP, HTTPS, and WebSocket traffic through BrowserPod's edge proxy servers. It also enables incoming connections to services running inside the Pod via [Portals](/docs/understanding-browserpod/portals). An edge network is charged per connected hour, in blocks of 10 tokens. See [Networking](/docs/understanding-browserpod/networking) for an overview.

## Parameters

- **opts (`object`)** - Configuration options.

## Options

- **apiKey (`string`)** - The [API key](/docs/understanding-browserpod/api-key) used to authenticate requests. The network can reach its allowed domains: BrowserPod's default domains, such as the npm registry and GitHub, or the ones you choose with Edge Pro in the [BrowserPod console](https://console.browserpod.io).

## Returns

A [Promise] that resolves to a `PodNetwork` instance. Pass it to [`BrowserPod.boot`](/docs/reference/BrowserPod/boot) as the `network` option.

## Example

```js
const network = await BrowserPod.createEdgeNetwork({ apiKey: "your_key_here" });
const pod = await BrowserPod.boot({ network });
```

Calling `BrowserPod.boot({ apiKey })` is shorthand for this.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
