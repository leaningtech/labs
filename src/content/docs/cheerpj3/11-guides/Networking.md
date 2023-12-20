---
title: Networking
description: Networking with CheerpJ
---

CheerpJ 3.0 supports different networking scenarios that are divided into two categories:

- Same-origin HTTP/HTTPS requests using fetch seamlessly.
- Generalized networking via Tailscale.

## Same origin HTTP/HTTPS requests

A Java application running in the browser with CheerpJ can request resources to the local server (same origin) via fetch through the HTTP/HTTPS protocols. As expected, these requests are asynchronous. Remember that for a request to be considered same-origin, it needs to match the scheme, hostname and port between the requester and the receiver.

The CheerpJ runtime API implements its own HTTP/HTTPS handler using the browser `fetch()`. To use this handler you need to pass into `cheerpjInit` with the `fetch` option as shown below:

```js
async function fetchExample(url, method, postData, headers) {
	return new Promise(function () {
		// body
	});
}
cheerpjInit({ fetch: fetchExample });
```

## Generalized networking

When it comes to generalized networking such as access to private network services, peer-to-peer connections or access to the wider internet, there are some browser-enforced limitations to enhance user's security. These limitations are bound to the browser not exposing access to lower-level protocols such as UDP and TCP. The browser only allows one to perform HTTP(S) requests ruled by CORS policies.

Another important scenario is the usage of WebSockets, where there is a two-way interaction between the user and the server in an event-driven manner. A WebSocket connection starts with a request from the browser via HTTP that when accepted, this connection is upgraded and does not conform to the HTTP protocol anymore. This way the user and the server can keep a connection and send bidirectional messages until this connection is closed from one of the endpoints.

To support these wider networking scenarios, it is necessary to host a proxy server, in which CheerpJ cannot become responsible for the user's traffic. For example, upgrading the WebSocket connection protocol and unwrapping packets before sending them to the destinations requires a proxy server.

These limitations have been overcome by supporting networking via Tailscale, a VPN technology using WebSockets and a transport layer. Using Tailscale has the big convenience of the developer having more control over the network, user connections, authentication etc.

### Tailscale

[Tailscale](https://tailscale.com/) is a VPN service based on the [WireGuard](https://www.wireguard.com/) protocol. It includes a control plane that manages the WireGuard keys of all the machines in the network and takes care of authenticating users. Tailscale allows one to use its VPN via its WebSocket proxy, meaning the perfect solution for the limitations described above.

#### Installing Tailscale

The easiest way to enable generalized networking on your Java application without modifying the source code is to [install Tailscale](https://tailscale.com/kb/1017/install) on your local server. This way the client can connect to your private Tailscale network via an auth key, and then talk to your server via the VPN.

#### Connecting your application to a Tailscale network

Connecting the Java application client to your Tailscale network is as simple as providing client authentication via `cheerpjInit()`:

Example for pre-authenticated nodes:

```js
cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleDnsUrl: "1.1.1.1",
	tailscaleAuthKey: "AuthKeyStringGoesHere",
});
```

What is happening here?

- `tailscaleControlUrl` is a string URL of the Tailscale control plane which verifies the user's identity. Only pass this option if you are [self-hosting Tailscale](https://github.com/leaningtech/headscale)
- `tailscaleDnsUrl` is a string with the IPv4 or IPv6 address to be used for DNS queries.
- `tailscaleAuthKey`: is string with an auth key to register new nodes that are pre-authenticated. You can create an auth key [here](https://login.tailscale.com/admin/settings/keys).

Example to prompt the user for manual login:

```js
cheerpjInit({
	tailscaleControlUrl: "https://my.url.com/",
	tailscaleDnsUrl: "1.1.1.1",
	tailscaleLoginUrlCb: function (url) {
		// your function code here to continue with login
	},
});
```

What is happening here?

- `tailscaleLoginUrlCb` expects the base URL of a control server that will continue and finish the login process. This callback is executed when it is time to prompt the user to log in to Tailscale via the UI.

> [!info] Info
> `tailscaleLoginUrlCb` and `tailscaleAuthKey` are mutually exclusive.

To learn more about CheerpJ's Tailscale APIs please visit [the reference](/cheerpj3/reference/cheerpjInit#tailscalecontrolurl).

### Self-hosting Headscale

Headscale is an open-source and self-hosted implementation of the Tailscale control server. To work with Headscale and CheerpJ we suggest using [this fork](https://github.com/leaningtech/headscale).
