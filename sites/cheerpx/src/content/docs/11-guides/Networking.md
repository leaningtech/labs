---
title: Networking
description: Networking with CheerpX
---

CheerpX supports different networking scenarios that are divided into two categories:

- Same-origin HTTP/HTTPS requests using fetch seamlessly.
- Generalized networking via Tailscale (anything else that is not HTTP(S) such as opening TCP/UDP sockets).

## Same origin HTTP/HTTPS requests

A CheerpX application running in the browser can request resources from the local server (same origin) via fetch through the HTTP/HTTPS protocols. As expected, these requests are asynchronous. Remember that for a request to be considered same-origin, it needs to match the scheme, host name and port between the requester and the receiver.

With CheerpX you can perform `fetch()` requests with the [browser fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) as usual.

## Generalized networking

CheerpX supports wider networking scenarios via Tailscale, which is a VPN technology using WebSockets and a transport layer. Tailscale enables the CheerpX application to access private network services, peer-to-peer connections or connect to the wider internet.

[Tailscale](https://tailscale.com/) is based on the [WireGuard](https://www.wireguard.com/) protocol. It includes a control plane that manages the WireGuard keys of all the machines in the network and takes care of authenticating users. Using this service provides more control over the network, user connections, authentication, security etc.

### Why Tailscale?

To support networking beyond same origin requests, it is necessary to host a proxy server. CheerpX cannot become responsible for the user's traffic as every application is different and its networking traffic should be managed internally and according to their needs.

When it comes to generalised networking scenarios, there are some browser-enforced limitations to enhance users' security. These limitations are bound to the browser not exposing access to lower-level protocols such as UDP and TCP. The browser only allows one to perform HTTP(S) requests ruled by CORS policies.

Native networking in the browser is extremely limited, only allowing HTTP connections to the same domain as the page. While WebSockets exist, they are not actual sockets but rather an extension to HTTP. This limitation makes it impossible to use the browser's `fetch` API for general networking purposes in CheerpX applications.

#### Limitations of using fetch for HTTPS/stack

Using `fetch` for HTTPS connections in CheerpX is not feasible due to several reasons:

1. Applications inside the VM would perform their own encryption, making it impossible to recover the requested URL.
2. The browser expects to handle HTTPS connections itself, which conflicts with the VM's networking stack.
3. HTTPS is even more challenging than HTTP in this context, as it requires managing certificates and encryption at the VM level.

These limitations necessitate a more comprehensive networking solution that can provide a full TCP/IP stack.

#### The need for a VPN solution

To overcome these limitations, CheerpX uses Tailscale, which provides a VPN solution via WebSockets. This approach allows CheerpX to implement a complete TCP/IP stack, enabling applications inside the VM to perform networking operations as they would on a regular machine.

Networking with WebVM always happens via Tailscale. To give access to your machine as part of the Tailscale internal network, you need to install Tailscale locally. The setup is effectively the same as with internet-enabled configurations; you can just skip enabling the exit node if you only need internal network access.

For a more detailed explanation of why Tailscale was chosen and how it works with WebVM, you can read our [blog post on WebVM networking via Tailscale](https://labs.leaningtech.com/blog/webvm-virtual-machine-with-networking-via-tailscale).

### Installing Tailscale

The easiest way to enable generalized networking on your CheerpX application without modifying the source code is to [install Tailscale](https://tailscale.com/kb/1017/install) on your local server. This way the client can connect to your private Tailscale network via an auth key, and then talk to your server via the VPN.

### Connecting your application to a Tailscale network

Connecting the CheerpX application client to your Tailscale network is as simple as providing client authentication via `CheerpX.Linux.create()`:

Example for pre-authenticated users/devices:

```js
const cx = await CheerpX.Linux.create({
	networkInterface: {
		authKey: "AuthKeyStringGoesHere",
		controlUrl: "https://my.url.com/",
	},
});
```

> [!info] Info
> A combination of a user and a device connected to a Tailscale network is called a _"node"_ in Tailscale terminology.

What is happening here?

- `controlUrl` is a string URL of the Tailscale control plane which verifies the user's identity. Only pass this option if you are [self-hosting Tailscale](/docs/guides/Networking#self-hosting-headscale).
- `authKey` is string with an auth key to register new users/devices that are pre-authenticated. You can create an auth key [here](https://login.tailscale.com/admin/settings/keys).

Example to prompt the user for manual login on a different tab:

```html
<a id="loginLink">Click here to login to Tailscale</a>
```

```js
const loginElem = document.getElementById("loginLink");

const cx = await CheerpX.Linux.create({
	networkInterface: {
		controlUrl: "https://my.url.com/",
		loginUrlCb: function (url) {
			loginElem.href = url;
			loginElem.target = "_blank";
			// continue with login
		},
	},
});
```

What is happening here?

- `loginUrlCb` expects the base URL of a control server that will continue and finish the login process. This callback is executed when it is time to prompt the user to log in to Tailscale via the UI.

### Self-hosting Headscale

Headscale is an open-source and self-hosted implementation of the Tailscale control server. To work with Headscale and CheerpX we suggest using [this fork](https://github.com/leaningtech/headscale).
