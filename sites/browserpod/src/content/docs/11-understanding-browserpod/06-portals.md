---
title: Portals
description: How Portals expose Pod servers to the outside world
---

A **Portal** is BrowserPod's controlled networking feature that exposes services running inside a Pod through secure, shareable URLs.

When code inside the Pod starts listening on a port, BrowserPod automatically creates a public URL that forwards traffic to that internal server. This unlocks powerful use cases that would traditionally require provisioning dedicated backend infrastructure for each session.

## What Portals enable

Portals unlock use cases that typically require backend infrastructure:

- **Live previews**: Run a dev server in the browser and share the preview URL with teammates or stakeholders. Changes update in real-time without deploying to staging environments.
- **Interactive demos**: Let users interact with working applications directly in documentation or product tours, without standing up demo infrastructure.
- **Collaborative workflows**: Enable pair programming, troubleshooting sessions, or live code reviews by sharing a running environment via a simple URL.
- **Shareable environments**: Create "click-to-open" demos where anyone with the link can access a fully functional application running in someone else's browser.
- **Testing across devices**: Scan a QR code on your phone to test the server running on your laptop's browser, with changes reflected instantly.

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

If you want the setup steps or code examples, see [Set up a Portal](/docs/guides/setup-portal).
