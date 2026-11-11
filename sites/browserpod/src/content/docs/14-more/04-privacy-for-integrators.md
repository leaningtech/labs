---
title: Privacy for integrators
description: "What happens to your users' data when your page runs BrowserPod, and what to mention in your own privacy policy."
---

If your website or application runs BrowserPod, your privacy policy should mention it. This page explains what reaches Leaning Technologies, and what doesn't, so you can describe it accurately. It is guidance, not legal advice.

## What stays on the device

Code and files in a Pod stay in the user's browser. BrowserPod doesn't upload them to us in order to run them, and the runtime sends no telemetry, licence checks or usage data. A Pod's filesystem is stored in the browser's own storage on the user's device.

## What reaches our CDN

To run, your users' browsers download the BrowserPod runtime from `rt.browserpod.io` and the disk images from `disks.browserpod.io`, as they would download a script or font from any other CDN. Like any web server, ours receives with each request:

- the user's IP address;
- the origin (and referrer) of your page;
- the browser's user agent;
- the file requested and the time.

We use this to deliver the files and prevent abuse, to count how many applications use BrowserPod and which runtime versions they use, and to identify organisations that use BrowserPod so we can offer support and licensing. **The usage data we keep records the page's origin, not users' IP addresses.** No cookies are set. The [BrowserPod Runtime Privacy Policy](https://browserpod.io/runtime-privacy) is the authoritative description.

If you pass your own `rootImage` or `userImage`, the disk requests go to your servers instead of ours. Self-hosting the runtime needs a [BrowserPod Enterprise Licence](/docs/more/licensing#enterprise).

## Network traffic from a Pod

What leaves the device when code in a Pod makes network requests depends on the [network](/docs/understanding-browserpod/networking) you boot it on:

- **Fetch network** (no API key): requests are made by the user's browser with `fetch()`, directly to the destination or through a proxy you choose. They don't pass through Leaning Technologies.
- **Edge network** (API key): the Pod's traffic passes through BrowserPod Edge, our network service, which applies your key's allowlist and keeps an audit log attributed to your account. The [BrowserPod Edge and Console Privacy Policy](https://browserpod.io/browserpod-privacy) says exactly what Edge records and in which cases it can see the content of a request.

## What to say in your privacy policy

Adapt something like this, depending on how you use BrowserPod:

> This site uses BrowserPod, by Leaning Technologies, to run code in your browser. Your browser downloads BrowserPod from Leaning Technologies' content delivery network, which receives your IP address, the address of this page and your browser's user agent, as described in the [BrowserPod Runtime Privacy Policy](https://browserpod.io/runtime-privacy). Code and files you run stay on your device.

If your Pods use Edge, add that network requests made from the sandbox pass through BrowserPod Edge, and link the [Edge privacy policy](https://browserpod.io/browserpod-privacy).
