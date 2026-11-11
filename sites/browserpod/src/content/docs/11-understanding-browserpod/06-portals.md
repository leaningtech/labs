---
title: Portals
description: How Portals let you preview and share services running inside a Pod
---

A **Portal** is a BrowserPod networking feature that gives a service running inside a [Pod](/docs/reference/BrowserPod) its own URL, so you can preview it and share it with others.

Portals are enabled by BrowserPod's [edge network](/docs/understanding-browserpod/networking), which requires an [API key](/docs/understanding-browserpod/api-key). When a Pod on the edge network starts listening on a port, BrowserPod automatically creates a URL that forwards traffic to that server.

## What Portals enable

Portals let you:

- **Preview your app**: Show a server running in the Pod in your own page, for example in an iframe.
- **Share it**: Send the URL to teammates so they can open the running app without deploying it.
- **Build demos**: Let users try a working app inside docs or product tours.
- **Test on other devices**: Open the URL on your phone to test a server running in your laptop's browser.

## How Portals work

- A Portal is not a separate server. The server runs inside the Pod, in the browser, and the Portal forwards traffic to it.
- Each port a server listens on gets its own Portal. [`onPortal`](/docs/reference/BrowserPod/onPortal) gives you its `url` and `port`.
- Anyone with the URL can reach the server.
- A Portal only works while the page running the Pod is open, and its URL changes every time the Pod boots.

If you want the setup steps or code examples, see [Set up a Portal](/docs/guides/setup-portal).
