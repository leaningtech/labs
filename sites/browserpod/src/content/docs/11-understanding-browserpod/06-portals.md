---
title: Portals
description: How Portals let you preview and share services running inside a Pod
---

A **Portal** is a BrowserPod networking feature that gives a service running inside a [Pod](/docs/reference/BrowserPod) its own URL.

Portals are part of [BrowserPod Edge](/docs/understanding-browserpod/api-key) (free tier available): they need a Pod booted on the [Edge network](/docs/understanding-browserpod/networking) with an API key. When a Pod on the Edge network starts listening on a port, BrowserPod automatically creates a URL that forwards traffic to that server.

## What Portals enable

Portals let you:

- **Preview your app**: Show a server running in the Pod on your own page, for example in an iframe.
- **Share it**: Send the URL to teammates so they can open the running app without deploying it.
- **Build demos**: Let users try a working app inside docs or product tours.
- **Test on other devices**: Open the URL on your phone to test a server running in your laptop's browser.

## How Portals work

- A Portal is not a separate server. The server runs inside the Pod, in the browser, and the Portal forwards traffic to it.
- Each port a server listens on gets its own Portal. [`onPortal`](/docs/reference/BrowserPod/onPortal) gives you its `url` and `port`.
- Anyone can reach the server, but its URL is randomly generated each time the Pod boots.
- A Portal only works while the page running the Pod is open..

If you want the setup steps or code examples, see [Set up a Portal](/docs/guides/setup-portal).
