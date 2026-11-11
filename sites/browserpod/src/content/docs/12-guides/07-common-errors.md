---
title: Debugging BrowserPod
description: Quick explanations for frequent BrowserPod errors
---

This page maps common BrowserPod error messages to their likely causes and fixes.

## Treating `pod.run` like a shell

- **Symptom**: errors when using `&&` or `|` inside `pod.run(...)`

- **Cause**: `pod.run` is like `execve` in Linux or `child_process.spawn` in Node. It does not support shell features like `||` or `&&` or builtins directly.

- **Solution**: Write complex behavior as a JavaScript script, and execute that.

## Missing or hidden terminal element

- **Symptoms**:
  - `The 'terminal' argument is required`
  - Output disappears during long runs

- **Cause**: The terminal element was never created or was unmounted.

- **Solution**: Keep `consoleEl` mounted. You can hide it with CSS, but do not remove it.

```js
const terminal = await pod.createDefaultTerminal(consoleEl);
...
pod.run(..., {terminal,...});
```

## Using the wrong file mode

- **Symptom**: `Unsupported 'mode' argument`

- **Cause**: `createFile` and `openFile` only accept `"binary"` or `"utf-8"`.

- **Solution**: Use `"binary"` for ArrayBuffer writes and `"utf-8"` for string writes.

## Running native binaries inside the Pod

- **Symptom**: Install failures or runtime crashes for tools like esbuild or rollup

- **Cause**: Prebuilt binaries from npm packages are compiled for your host CPU architecture, not Wasm, so they don't run in the Pod.

- **Solution**: Use Wasm alternatives and `package.json` overrides. See the
  [native npm dependencies guide](/docs/guides/working-around-native-npm-dependencies). If you're compiling your own program rather than relying on a prebuilt package, see [Installing the Rust toolchain](/docs/guides/installing-rust-toolchain) for how to target BrowserPod directly.

## `npm install` fails without an API key

- **Symptoms**:
  - `npm error code ECONNRESET`
  - Browser console: `Response to preflight request doesn't pass access control check`

- **Cause**: Without an API key, the Pod uses the fetch network, and the npm registry blocks the requests npm sends from the browser.

- **Solution**: Create the fetch network with `opinionatedFetch`. See [Using npm without an API key](/docs/understanding-browserpod/networking#using-npm-without-an-api-key).

```js
const network = await BrowserPod.createFetchNetwork({
	fetch: BrowserPod.opinionatedFetch,
});
const pod = await BrowserPod.boot({ network });
```

## Requests blocked by CORS

- **Symptoms**:
  - `fetch failed` (cause `UND_ERR_SOCKET`) in Node, or `Empty reply from server` in curl
  - Browser console: `blocked by CORS policy`

- **Cause**: On the fetch network, requests come from the browser, so the server must allow cross-origin requests.

- **Solution**: Boot with an API key if the server is on the edge network's allowed domains. See [Fetch network and CORS](/docs/understanding-browserpod/networking#fetch-network-and-cors). If `npm install` fails, see [`npm install` fails without an API key](#npm-install-fails-without-an-api-key).

## Domain not reachable with an API key

- **Symptoms**:
  - `ENOTFOUND` or `Could not resolve host`
  - Browser console: `DNS query blocked for non-whitelisted domain`

- **Cause**: On the edge network, Pods can only reach BrowserPod's default domains, or the domains you chose for your key.

- **Solution**: With a Pro plan, add the domain in the [BrowserPod console](https://console.browserpod.io). If the server allows CORS, you can also reach it without a key.

## The Pod never finishes booting

- **Symptoms**:
  - `await BrowserPod.boot(...)` never resolves
  - Browser console: `WebSocket connection failed, check your API key.` or `HTTP Authentication failed`

- **Cause**: The API key is empty or invalid. An empty string still counts as a key.

- **Solution**: Check that the key in your code or `.env` is complete and correct, or create a new one in the [BrowserPod console](https://console.browserpod.io).

## Errors when passing a network to `boot`

- **Symptoms**:
  - `BrowserPod: apiKey and apiOrigin go to BrowserPod.createEdgeNetwork when a network is given`
  - `BrowserPod: network already serves another pod`

- **Cause**: When you pass `network`, the key belongs in `createEdgeNetwork`, and each network object can serve only one Pod.

- **Solution**: Pass `apiKey` to `createEdgeNetwork` instead of `boot`, and create a new network for each Pod.

## No Portal URL appears

- **Symptom**: The `onPortal` callback never runs

- **Cause**: Portals need the edge network, which requires an API key.

- **Solution**: Boot with an API key. See [Portals](/docs/understanding-browserpod/portals).
