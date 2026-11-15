---
title: BrowserPod Edge
description: What BrowserPod Edge is, how its API keys work and where to place them
---

BrowserPod Edge connects your Pods to the internet. A Pod uses Edge when you boot it with an API key: its traffic then goes through the [Edge network](/docs/understanding-browserpod/networking), which reaches its allowed domains without CORS limits, carries TCP connections to them, and enables [Portals](/docs/understanding-browserpod/portals). The allowed domains are BrowserPod's default domains, or the ones you choose with Edge Pro.

The API key identifies your app to BrowserPod and tracks your token usage. Edge is charged per connected hour; see [Licensing](/docs/more/licensing#browserpod-edge) for the free allowance.

Pods can also boot without an API key on a **fetch network**, which routes network requests directly through your browser using `fetch()`. It's free, but subject to browser CORS rules. See [Networking](/docs/understanding-browserpod/networking) for details.

## Register for an API key

1. Register at https://console.browserpod.io
2. Create a key in **Keys & Domains**

## Where to store the API key

In a browser app, the key will ultimately be available to the client, so we recommend restricting it to your app's origins when you create it in the console. The main difference between approaches is **how you manage it during development and deployment**.

### Method 1: Inline in JavaScript (simple, not recommended for production)

You can pass the key directly when booting the Pod:

```js
const pod = await BrowserPod.boot({
	apiKey: "your_key_here",
});
```

This is fine for quick prototypes but not ideal for production, because the key is hard-coded in your source.

### Method 2: Environment variable via `.env` (recommended for development)

Store the key in a `.env` file and reference it in code:

```
VITE_BP_APIKEY=your_key_here
```

```js
const pod = await BrowserPod.boot({
	apiKey: import.meta.env.VITE_BP_APIKEY?.trim() || undefined,
});
```

This keeps the key out of source control and makes local development easier.

> [!note]
> To boot without a key, comment out or remove the `VITE_BP_APIKEY` line. The `?.trim() || undefined` part covers a line left empty: without it, `VITE_BP_APIKEY=` would still count as a key, and `boot` would never finish.

### Method 3: Hosting provider env variables (recommended for production)

Most hosting platforms let you define environment variables (or “secrets”) at deploy time. Your build system can then expose the value to the client bundle in the same way as `.env` during local development.
