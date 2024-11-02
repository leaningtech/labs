---
title: Networking
description: Networking with CheerpJ
---

CheerpJ supports different networking scenarios that are divided into two categories:

- Same-origin HTTP/HTTPS requests using fetch seamlessly.
- Generalized networking via Tailscale (anything else that is not HTTP(S) such as opening TCP/UDP sockets).

## Same origin HTTP/HTTPS requests

A Java application running in the browser with CheerpJ can request resources to the local server (same origin) via fetch through the HTTP/HTTPS protocols. As expected, these requests are asynchronous. Remember that for a request to be considered same-origin, it needs to match the scheme, host name and port between the requester and the receiver.

With CheerpJ you can perform `fetch()` requests with the [browser fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) as usual.

## Generalized networking

CheerpJ supports wider networking scenarios via Tailscale, which is a VPN technology using WebSockets and a transport layer. Tailscale enables the Java application to access private network services, peer-to-peer connections or connect to the wider internet.

[Tailscale](https://tailscale.com/) is based on the [WireGuard](https://www.wireguard.com/) protocol. It includes a control plane that manages the WireGuard keys of all the machines in the network and takes care of authenticating users. Using this service provides more control over the network, user connections, authentication, security etc.

![CheerpJ 3.0 general networking](/docs/cheerpj3/assets/general_networking.png)

### Why Tailscale?

To support networking beyond same origin requests, it is necessary to host a proxy server. CheerpJ cannot become responsible for the user's traffic as every application is different and its networking traffic should be managed internally and according to their needs.

When it comes to generalised networking scenarios, there are some browser-enforced limitations to enhance users' security. These limitations are bound to the browser not exposing access to lower-level protocols such as UDP and TCP. The browser only allows one to perform HTTP(S) requests ruled by CORS policies.

A good example of this scenario is when an application uses WebSockets, where there is a two-way interaction between two end-points in an event-driven manner. A WebSocket connection starts with a request from the browser via HTTP that when accepted, this connection is upgraded and does not conform to the HTTP protocol anymore. This way the user and the server (or any other end-point) can keep a connection and send bidirectional messages until this connection is closed from one of the end-points. Upgrading the WebSocket connection protocol and unwrapping packets before sending them to the destinations requires a proxy server.

These limitations have been overcome by supporting networking via Tailscale, which allows one to use its VPN via its WebSocket proxy, meaning the perfect solution for the limitations described above.

### Installing Tailscale

The easiest way to enable generalized networking on your Java application without modifying the source code is to [install Tailscale](https://tailscale.com/kb/1017/install) on your local server. This way the client can connect to your private Tailscale network via an auth key, and then talk to your server via the VPN.

### Connecting your application to a Tailscale network

Connecting the Java application client to your Tailscale network is as simple as providing client authentication via `cheerpjInit()`:

Example for pre-authenticated users/devices:

```js
cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleAuthKey: "AuthKeyStringGoesHere"
});
```

> [!info] Info
> A combination of a user and a device connected to a Tailscale network is called a _"node"_ in Tailscale terminology.

What is happening here?

- `tailscaleControlUrl` is a string URL of the Tailscale control plane which verifies the user's identity. Only pass this option if you are [self-hosting Tailscale](/docs/guides/Networking#self-hosting-headscale).
- `tailscaleAuthKey` is string with an auth key to register new users/devices that are pre-authenticated. You can create an auth key [here](https://login.tailscale.com/admin/settings/keys).

Example to prompt the user for manual login on a different tab:

```html
<a id="loginLink">Click here to login to Tailscale</a>
```

```js
const loginElem = document.getElementById("loginLink");

cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleLoginUrlCb: function (url) {
		loginElem.href = url;
		loginElem.target = "_blank";
		// continue with login
	}
});
```

What is happening here?

- `tailscaleLoginUrlCb` expects the base URL of a control server that will continue and finish the login process. This callback is executed when it is time to prompt the user to log in to Tailscale via the UI.

> [!info] Info
> `tailscaleLoginUrlCb` and `tailscaleAuthKey` are mutually exclusive.

To learn more about CheerpJ's Tailscale APIs please visit [the reference](/docs/reference/cheerpjInit#tailscalecontrolurl).

### Self-hosting Headscale

Headscale is an open-source and self-hosted implementation of the Tailscale control server. To work with Headscale and CheerpJ we suggest using [this fork](https://github.com/leaningtech/headscale).
