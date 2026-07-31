---
title: Set up a Portal
description: Expose a local server with a BrowserPod Portal URL
---

This guide shows how to listen on a port and expose it via a Portal URL.

## 1. Register a Portal handler

Register a callback so you can capture the Portal URL when it appears:

```js
pod.onPortal(({ url, port }) => {
	console.log(`Portal URL: ${url} (local port ${port})`);
});
```

## 2. Start a server inside the Pod

When your server listens on a port, BrowserPod will create a Portal:

```js
pod.run("node", ["server.js"], {
	echo: true,
	terminal,
	cwd: "/project",
});
```

In your server code:

```js
server.listen(3000, () => {
	console.log("Server listening on port 3000");
});
```

## 3. Use the Portal URL

A common pattern is to display the URL and load it in an iframe:

```js
const iframe = document.querySelector("#preview");
const urlDiv = document.querySelector("#url");

pod.onPortal(({ url }) => {
	urlDiv.innerHTML = `Portal available at <a href="${url}">${url}</a>`;
	iframe.src = url;
});
```

## Notes

- The Portal URL is the address your users should open.
- The `port` value is the internal port inside the Pod that triggered the Portal.
- If multiple servers listen on different ports, you will receive a callback for each Portal.
