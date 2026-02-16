---
title: Understanding Portals
description: How Portals expose Pod servers to the outside world
---

A **Portal** is BrowserPod’s way of exposing a server running inside a Pod to the outside world. 

When code inside the Pod starts listening on a port, BrowserPod creates a public URL that forwards traffic to that internal server.

## What a Portal is

A Portal is not a separate server. It is a routing layer that connects a public URL to a process running in the user’s browser. The server still lives inside the Pod; the Portal simply makes it reachable.

## How Portals are created

Portals are created automatically when a process inside the Pod binds to a port. BrowserPod detects the listening port and generates a URL that maps to it. If multiple ports are opened, multiple Portals can be created.

## What the URL represents

The Portal URL is the address other people can open to reach the server running inside the browser. The `port` value that triggers the Portal is the internal port the server is listening on inside the Pod.

## What Portals imply for your app

- **Your server is truly client‑side.** The app logic is running in the user’s browser, not on your infrastructure.
- **The URL is the access point.** Anyone with the Portal URL can reach the server (within the limits of your app).
- **Ports map to Portals.** Each listening port can create its own Portal URL.

If you want the setup steps or code examples, see [Set up a Portal](/docs/13-guides/setup-Portal).
