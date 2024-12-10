---
title: Networking
description: Networking with CheerpX
---

CheerpX supports networking scenarios via Tailscale, which is a VPN technology using WebSockets and a transport layer. Tailscale enables the CheerpX application to access private network services, peer-to-peer connections or connect to the wider internet.

[Tailscale](https://tailscale.com/) is based on the [WireGuard](https://www.wireguard.com/) protocol. It includes a control plane that manages the WireGuard keys of all the machines in the network and takes care of authenticating users. Using this service provides extensive control over the network, user connections, authentication, security etc.

## Why Tailscale?

To support networking beyond same origin requests, it is necessary to host a proxy server. CheerpX cannot become responsible for the user's traffic as every application is different and its networking traffic should be managed internally and according to their needs.

When it comes to generalised networking scenarios, there are some browser-enforced limitations to enhance users' security. These limitations are bound to the browser not exposing access to lower-level protocols such as UDP and TCP. The browser only allows one to perform HTTP(S) requests ruled by CORS policies.

Native networking in the browser is extremely limited, only allowing HTTP connections to the same domain as the page. While WebSockets exist, they are not actual sockets but rather an extension to HTTP. This limitation makes it impossible to use the browser's `fetch` API for general networking purposes in CheerpX applications.

> [!question] Why can't CheerpX at least support HTTP/HTTPS traffic using `fetch`
> Using `fetch` for HTTP/HTTPS connections in CheerpX is not feasible for two reasons:
>
> 1. In the common case of HTTPS, applications inside the VM would perform their own encryption, making it impossible to recover the requested URL.
> 2. The browser always enforces cross-origin rules and cross-domain requests are only allowed by a small subset of domains, making it very unlikely that an aribitrary application could work when attempting HTTP traffic via fetch.
>    These limitations necessitate a more comprehensive networking solution that can provide a full TCP/IP stack.

### The need for a VPN solution

To overcome these limitations, CheerpX uses Tailscale, which provides a VPN solution via WebSockets. This approach allows CheerpX to implement a complete TCP/IP stack, enabling applications inside the VM to perform networking operations as they would on a regular machine.

Networking with WebVM always happens via Tailscale. To give access to your local or development machine as part of the Tailscale internal network, you need to install Tailscale locally. The setup is effectively the same as with internet-enabled configurations; you can just skip enabling the exit node if you only need internal network access.

> [!note] Note
> WebVM-to-WebVM networking can be achieved via Tailscale without the need for any exit node. This solution could be useful for client/server applications running entirely without WebVM and peer-to-peer applications such as multiplayer games.

For a more detailed explanation of why Tailscale was chosen and how it works with WebVM, you can read our [blog post on WebVM networking via Tailscale](https://labs.leaningtech.com/blog/webvm-virtual-machine-with-networking-via-tailscale).

## Setting up an exit node

An exit node is a device on the Tailscale network that routes internet traffic from other Tailscale devices through its connection, making it appear as if the traffic originates from the exit node's location. This can be useful for security purposes or to access content that is restricted to certain regions.

### When do you need an exit node?

You need an exit node if you want to:

- Access the internet, which always requires an exit node in CX.
- Enhance security by routing traffic through a trusted system.
- Connect to services that restrict access based on a certain IP address or region.

If your use case only involves internal access within the Tailscale network (for example, WebVM-to-WebVM communication or connecting to local network services), you do **not** need to set up an exit node.

### How to set up an exit node

Tailscale can be downloaded, installed, and updated in different ways depending on your system. For detailed instructions, refer to the [install Tailscale](https://tailscale.com/kb/1347/installation) guide and choose the appropriate method for your system.

1. Advertise a device as an exit node

On the device you want to use as the exit node, run:

```bash
sudo tailscale up --advertise-exit-node
```

This makes the device available as an exit node for other Tailscale devices.

For more details on configuring and using exit nodes, refer to Tailscale’s [Exit nodes](https://tailscale.com/kb/1103/exit-nodes) documentation.

## Client applications with existing backends

The easiest way to connect a client application running in CheerpX with traditional backends (either on the public internet or private network), is to [install Tailscale](https://tailscale.com/kb/1017/install) on your backend server. This way the client can connect to your private Tailscale network via an auth key, and then talk to your server via the VPN.

## Connecting your application to a Tailscale network

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

- `controlUrl` is a string URL of the Tailscale control plane which verifies the user's identity. You only need to pass this option if you are [self-hosting Tailscale](/docs/guides/Networking#self-hosting-headscale).
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

## Self-hosting Headscale

Headscale is an open-source and self-hosted implementation of the Tailscale control server. The upstream version of Headscale does not yet properly support the WebSocket transport. For the time being, please use [our fork](https://github.com/leaningtech/headscale).
