---
title: Networking
description: How networking works in BrowserPod and the differences between Edge and fetch networks.
---

A [Pod](/docs/reference/BrowserPod) connects to the internet using one of two network types. Both carry outgoing HTTP, HTTPS, and WebSocket traffic. Regardless of network, the programs in a Pod reach each other's servers on `localhost`.

|                                                          | **Edge Network**                                                                                                                                                                                                                                              | **Fetch Network**                                                                                                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing                                                  | Routes traffic through [BrowserPod Edge](/docs/understanding-browserpod/api-key).                                                                                                                                                                             | Routes traffic through the browser's standard [`fetch()`][fetch].                                                                                    |
| API & Billing                                            | Requires an [API key](/docs/understanding-browserpod/api-key) and is billed per connected hour in blocks of 10 tokens (see [Licensing](/docs/more/licensing#browserpod-edge) for the free allowance).                                                         | Does not require an API key, and is free to use.                                                                                                     |
| Reach                                                    | Reaches its [allowed domains](#allowed-domains): BrowserPod’s default domains, such as the npm registry and GitHub, or the ones you choose with [Edge Pro](/docs/more/licensing#browserpod-edge) in the [BrowserPod console](https://console.browserpod.io/). | Reaches servers that allow cross-origin requests ([CORS](#fetch-network-and-cors)). npm needs [one extra setup step](#using-npm-without-an-api-key). |
| Traffic                                                  | HTTP, HTTPS, and WebSocket, it carries other TCP connections to its allowed domains.                                                                                                                                                                          | HTTP, HTTPS, and WebSocket traffic only, with no other TCP connections.                                                                              |
| [Portal](/docs/understanding-browserpod/portals) support | Yes                                                                                                                                                                                                                                                           | No                                                                                                                                                   |

## Choosing a network

[`BrowserPod.boot`](/docs/reference/BrowserPod/boot) picks the network based on whether you pass an `apiKey`.

Pass an API key to boot on the Edge network:

```js
const pod = await BrowserPod.boot({ apiKey: "your_key_here" });
```

Omit it to boot on the fetch network:

```js
const pod = await BrowserPod.boot();
```

To customize network settings, create a network object with [`createEdgeNetwork`](/docs/reference/BrowserPod/createEdgeNetwork) or [`createFetchNetwork`](/docs/reference/BrowserPod/createFetchNetwork) and pass it to `boot` as `network`, as in [Using npm without an API key](#using-npm-without-an-api-key) below. Each network object can be used by one Pod only. When you pass `network`, don't also pass `apiKey` to `boot`; give it to `createEdgeNetwork` instead.

## Using npm without an API key

On a plain fetch network, `npm install` fails: npm adds headers to its requests that the registry doesn't accept, so the browser blocks them. To use npm without an API key, create the fetch network with [`opinionatedFetch`](/docs/reference/BrowserPod/opinionatedFetch):

```js
const network = await BrowserPod.createFetchNetwork({
	fetch: BrowserPod.opinionatedFetch,
});
const pod = await BrowserPod.boot({ network });
```

## Allowed domains

The Edge network only reaches its allowed domains. By default, these are:

| Service                 | Domains                                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| npm and Yarn            | `registry.npmjs.org`, `repo.yarnpkg.com`                                                                                                 |
| GitHub                  | `github.com`, `raw.githubusercontent.com`                                                                                                |
| Gemini CLI              | `oauth2.googleapis.com`, `www.googleapis.com`, `cloudcode-pa.googleapis.com`, `play.googleapis.com`, `generativelanguage.googleapis.com` |
| Claude Code, OpenRouter | `api.anthropic.com`, `platform.claude.com`, `downloads.claude.ai`, `openrouter.ai`                                                       |
| Codex                   | `chatgpt.com`, `auth.openai.com`, `api.openai.com`                                                                                       |

With [Edge Pro](/docs/more/licensing#browserpod-edge), you can change this per API key under **API > Keys & Domains** in the [BrowserPod console](https://console.browserpod.io):

- Add your own list of domains.
- Choose whether the default domains stay allowed alongside your own.
- Allow all domains.

## Fetch network and CORS

Requests on a fetch network come straight from the browser, so they follow the browser's **Cross-Origin Resource Sharing (CORS)** rules: a server must allow requests from your page's origin, or the browser blocks them.

To reach a server that doesn't allow this, boot on the Edge network with an [API key](/docs/understanding-browserpod/api-key), or route requests through your own proxy with a [custom fetch handler](/docs/reference/BrowserPod/createFetchNetwork#custom-fetch-handler).

## Fetch network and WebSockets

WebSocket connections work on a fetch network with no extra setup. Only a custom `fetch` function that handles WebSocket traffic itself, instead of forwarding it, has to complete the upgrade; see [`createFetchNetwork`](/docs/reference/BrowserPod/createFetchNetwork#websocket-connections).

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
