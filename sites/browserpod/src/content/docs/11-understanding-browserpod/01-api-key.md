---
title: API keys
description: How BrowserPod API keys work and where to place them
---

An API key connects your Pods to BrowserPod's [edge network](/docs/understanding-browserpod/networking) and tracks your token usage. It identifies your app to BrowserPod.

Pods can also boot without an API key on a **fetch network**, which routes network requests directly through your browser using `fetch()`. It's free, but subject to browser CORS rules.

An API key is only needed for the **edge network**. It isn't limited by CORS: it reaches BrowserPod's default domains, and with a Pro plan you can choose which domains it can reach. It also enables [Portals](/docs/understanding-browserpod/portals). See [Networking](/docs/understanding-browserpod/networking) for details.

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
	apiKey: import.meta.env.VITE_BP_APIKEY,
});
```

This keeps the key out of source control and makes local development easier.

> [!note]
> An empty `VITE_BP_APIKEY=` still counts as a key, and `boot` never finishes. To boot without a key, leave the line out or comment it out.

### Method 3: Hosting provider env variables (recommended for production)

Most hosting platforms let you define environment variables (or “secrets”) at deploy time. Your build system can then expose the value to the client bundle in the same way as `.env` during local development.
