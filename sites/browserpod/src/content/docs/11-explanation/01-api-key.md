---
title: API keys
description: How BrowserPod API keys work and where to place them
---

An API key is a secret code that lets your app access a BrowserPod API. It identifies your app and tracks usage. You want to keep it private and include it in your environment so the service knows the requests are coming from you. Think of it like a password for your program to use BrowserPod.

## Register for an API key

1. Register at https://console.browserpod.io
2.  Create a key in **Keys & Domains**

## Where to store the API key

In a browser app, the key will ultimately be available to the client. The main difference between approaches is **how you manage it during development and deployment**.

### Method 1: Inline in JavaScript (simple, not recommended for production)

You can pass the key directly when booting the pod:

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

### Method 3: Hosting provider env variables (recommended for production)

Most hosting platforms let you define environment variables (or “secrets”) at deploy time. Your build system can then expose the value to the client bundle in the same way as `.env` during local development.
