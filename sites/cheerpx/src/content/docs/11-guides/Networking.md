---
title: Networking
description: Networking with CheerpX
---

CheerpX supports networking scenarios via Tailscale, which is a VPN technology using WebSockets and a transport layer. Tailscale enables the CheerpX application to access private network services, peer-to-peer connections or connect to the wider internet.

[Tailscale](https://tailscale.com/) is based on the [WireGuard](https://www.wireguard.com/) protocol. It includes a control plane that manages the WireGuard keys of all the machines in the network and takes care of authenticating users. Using this service provides extensive control over the network, user connections, authentication, security etc.

### Why Tailscale?

To support networking beyond same origin requests, it is necessary to host a proxy server. CheerpX cannot become responsible for the user's traffic as every application is different and its networking traffic should be managed internally and according to their needs.

When it comes to generalised networking scenarios, there are some browser-enforced limitations to enhance users' security. These limitations are bound to the browser not exposing access to lower-level protocols such as UDP and TCP. The browser only allows one to perform HTTP(S) requests ruled by CORS policies.

Native networking in the browser is extremely limited, only allowing HTTP connections to the same domain as the page. While WebSockets exist, they are not actual sockets but rather an extension to HTTP. This limitation makes it impossible to use the browser's `fetch` API for general networking purposes in CheerpX applications.

> [!question] Why can't CheerpX at least support HTTP/HTTPS traffic using `fetch`
> Using `fetch` for HTTP/HTTPS connections in CheerpX is not feasible for two reasons:
>
> 1. In the common case of HTTPS, applications inside the VM would perform their own encryption, making it impossible to recover the requested URL.
> 2. The browser always enforces cross-origin rules and cross-domain requests are only allowed by a small subset of domains, making it very unlikely that an aribitrary application could work when attempting HTTP traffic via fetch.
>    These limitations necessitate a more comprehensive networking solution that can provide a full TCP/IP stack.

#### The need for a VPN solution

To overcome these limitations, CheerpX uses Tailscale, which provides a VPN solution via WebSockets. This approach allows CheerpX to implement a complete TCP/IP stack, enabling applications inside the VM to perform networking operations as they would on a regular machine.

Networking with WebVM always happens via Tailscale. To give access to your local or development machine as part of the Tailscale internal network, you need to install Tailscale locally. The setup is effectively the same as with internet-enabled configurations; you can just skip enabling the exit node if you only need internal network access.

It's important to note that WebVM-to-WebVM networking can be achieved via Tailscale without the need for any exit node. This solution could be useful for client/server applications running entirely without WebVM and peer-to-peer applications such as multiplayer games.

For a more detailed explanation of why Tailscale was chosen and how it works with WebVM, you can read our [blog post on WebVM networking via Tailscale](https://labs.leaningtech.com/blog/webvm-virtual-machine-with-networking-via-tailscale).

### Client applications with existing backends

The easiest way to connect a client application running in CheerpX with traditional backends, either on the public internet or private network), is to [install Tailscale](https://tailscale.com/kb/1017/install) on your backend server. This way the client can connect to your private Tailscale network via an auth key, and then talk to your server via the VPN.

### Connecting your application to a Tailscale network

Connecting the CheerpX application client to your Tailscale network is as simple as providing client authentication via `CheerpX.Linux.create()`:

Example for pre-authenticated users/devices:

```js
const cx = await CheerpX.Linux.create({
	networkInterface: {
		authKey: "AuthKeyStringGoesHere",
		controlUrl: "https://my.url.com/",
		stateUpdateCb: (state) => {
			console.log("Network state changed to:", state);
		},
		netmapUpdateCb: (map) => {
			console.log("Network mapping updated:", map);
		},
	},
});
```

> [!info] Info
> A combination of a user and a device connected to a Tailscale network is called a _"node"_ in Tailscale terminology.

What is happening here?

- [authKey]: A string containing an authentication key for registering pre-authenticated users or devices. You can generate one [here](https://login.tailscale.com/admin/settings/keys).
- [controlUrl]: The Tailscale control plane URL for identity verification. This is only needed if you are [self-hosting Tailscale](/docs/guides/Networking#self-hosting-headscale).
- [stateUpdateCb]: A required callback function that monitors and reports changes in network status.
- [netmapUpdateCb]: A callback function that provides updates on the network map, enabling access to network mapping information.

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
		stateUpdateCb: (state) => {
			console.log("Network state changed:", state);
		},
		netmapUpdateCb: (map) => {
			console.log("Received network map:", map);
		},
	},
});
```

What is happening here?

- [loginUrlCb] expects the base URL of a control server that will continue and finish the login process. This callback is executed when prompting the user to log in interactively with Tailscale.
- [stateUpdateCb] and [netmapUpdateCb] are necessary for tracking network status and updates to network maps.

### Self-hosting Headscale

Headscale is an open-source and self-hosted implementation of the Tailscale control server. The upstream version of Headscale does not yet properly support the WebSocket transport. For the time being, please use [our fork](https://github.com/leaningtech/headscale).

[controlUrl]: /docs/reference/CheerpX-Linux-create#controlurl
[authKey]: /docs/reference/CheerpX-Linux-create#authkey
[stateUpdateCb]: /docs/reference/CheerpX-Linux-create#stateupdatecb
[netmapUpdateCb]: /docs/reference/CheerpX-Linux-create#netmapupdatecb
[loginUrlCb]: /docs/reference/CheerpX-Linux-create#loginurlcb
