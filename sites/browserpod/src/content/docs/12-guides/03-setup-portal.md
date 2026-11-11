---
title: Set up a Portal
description: Preview and share a server running in a Pod with a Portal URL
---

This guide shows how to start a server inside a Pod and get a Portal URL to preview and share it.

> [!note]
> Portals need an [API key](/docs/understanding-browserpod/api-key). Boot the Pod with one before you start.

_This guide assumes you have a [terminal](/docs/guides/run-programs-in-a-pod) and your server code in `/project` (see [Write files to the Pod](/docs/guides/write-files-to-pod))._

## 1. Add a preview to your page

```html
<div id="url">Waiting for Portal...</div>
<iframe id="preview"></iframe>
```

## 2. Register a Portal handler

Register a callback with [`onPortal`](/docs/reference/BrowserPod/onPortal) to show the Portal URL and load it in the iframe:

```js
const iframe = document.querySelector("#preview");
const urlDiv = document.querySelector("#url");

pod.onPortal(({ url, port }) => {
	urlDiv.innerHTML = `Portal for port ${port}: <a href="${url}">${url}</a>`;
	iframe.src = url;
});
```

## 3. Start a server inside the Pod

When your server listens on a port, BrowserPod creates a Portal:

```js
pod.run("node", ["server.js"], {
	echo: true,
	terminal,
	cwd: "/project",
});
```

A minimal `server.js`:

```js
require("http")
	.createServer((req, res) => res.end("Hello from the Pod"))
	.listen(3000);
```

## Notes

- Open the Portal URL to preview the server, or share it with others.
- If multiple servers listen on different ports, you will receive a callback for each Portal.
