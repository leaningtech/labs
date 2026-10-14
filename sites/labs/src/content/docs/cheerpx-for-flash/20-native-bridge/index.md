---
title: Native Bridge
---

In a small number of use cases, our customer could have the following scenario:

- They are experiencing large performance bottlenecks due to:
  - Having a very large (typically Flex based) application
  - Having slower/older end user machines
  - A combination of a heavy application and slower machines
- They only have a small number of end users, that provide a lot of value.

This specific case is typically a corporate application, but doesn't necessarily have to be.

In this specific use case, we will offer our 'Native Bridge' to the customer.

## What does the Native Bridge do?

The Native Bridge removes some of the computational load from the end users machine, and onto a Websockets server hosted by the customer. It communicates entirely via Websockets messages, exchanging primarily I/O information (mouse and keyboard inputs, video and audio outputs). We find that the Native Bridge dramatically improves performance for end users.

We call this component the 'Native Bridge' because it bridges the gap to near native-like speed.

We typically don't ship the Native Bridge until a user has tested CheerpX in its standard deployment, because in an ideal scenario CheerpX would work right out of the box for the user.

There are two drawbacks when using the Native Bridge:

- It adds an additional complexity to the installation procedure.
- The customer incurs a hosting cost. Before, the cost for hosting and running CheerpX was 0, because it only required a simple HTTP server. Now, computational cost becomes a factor.

## How is the Native Bridge installed?

The Native Bridge is a containerised service packaged as a Docker container. It comes shipped as a standard .tar file, which can be loaded into Docker using `docker load`.

You then run the image, with the configuration options of your own choosing. The websockets server within the container will run on port :28083, but you can bind this to any port on the host machine that you may choose.

Although everyone's own Docker environments will differ, and you are at your own discretion to run the image however you may wish to, an example `docker run` command could be:

`docker run -p 28083:28083 --init --rm -v /path/to/harman/binary/ppdeploy/ppfp/:/flash localhost/ppfp_bridge:20261014_prod42`

Here, we are using a few flags:

- `-p 28083:28083` simply binds the host port :28083 to the container port :28083.
- `--init` will kill any zombie processes left behind after the container is stopped.
- `--rm` will remove the container after it is stopped.
- `-v /path/to/harman/binary/ppdeploy/ppfp/:/flash` is the **most important** flag in the command. To run the Native Bridge, you need to mount a volume with the Harman provided `libHCSFP.so` file inside the container at `/flash`.

Finally, we just run the latest build of the bridge that has been shipped, and loaded into docker.

## How do I configure the Native Bridge?

Once the Native Bridge is installed, you simply need to tell CheerpX to talk to the Websockets server with one simple flag in the ppInit function. This would make the initial integration:

`<script src="https://mydomain.com/cheerpx/pp.js"></script>`

`<script>window.onload = (event) => { ppInit() }</script>`

Simply become something that looks like this:

`<script src="https://mydomain.com/cheerpx/pp.js"></script>`

`<script>window.onload = (event) => { ppInit({ bridgeURL: "ws://myWebsocketServer.mydomain.com:28083" }) }</script>`

As long as the URL specified can be reached by CheerpX, your installation of CheerpX for Flash will now be talking to the Websocket server, and your performance should be massively improved.

## How do I restrict who can connect to the Native Bridge?

The browser of every end user must reach the Websockets server, so in most deployments anyone can connect to it. From version 42, the Native Bridge can optionally validate a token on every connection. We recommend enabling it for any bridge reachable from outside a trusted network.

### Start the bridge with a key

Choose a long random secret, the **key**, and pass it as the last argument of `docker run`:

`docker run -p 28083:28083 --init --rm -v /path/to/harman/binary/ppdeploy/ppfp/:/flash localhost/ppfp_bridge:20261014_prod42 <key>`

Without a key, the bridge accepts every connection, as in previous versions, and logs `no key given, connections are not authenticated` at startup.

### Generate a token on your server

When your server renders a page that uses the bridge, it generates a short-lived **token** from the key:

1. Pick an expiry time, as Unix seconds, a few minutes in the future.
2. Compute the HMAC-SHA256 of the string `v1.<expiry>`, with the expiry written in decimal, using the key.
3. Encode the resulting string in hexadecimal
4. The token is `v1.<expiry>.<hmac>`.

For example, in JavaScript, using the Web Crypto API available in browsers, Node.js 19+, Deno, Bun and Cloudflare Workers:

```js
async function bridgeToken(key, validForSeconds = 300) {
	const enc = new TextEncoder();
	const payload = `v1.${Math.floor(Date.now() / 1000) + validForSeconds}`;
	const hmacKey = await crypto.subtle.importKey(
		"raw",
		enc.encode(key),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"]
	);
	const mac = new Uint8Array(
		await crypto.subtle.sign("HMAC", hmacKey, enc.encode(payload))
	);
	const hex = Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
	return `${payload}.${hex}`;
}
```

Or in Python:

```python
import hashlib, hmac, time

def bridge_token(key: str, valid_for_seconds: int = 300) -> str:
    payload = f"v1.{int(time.time()) + valid_for_seconds}"
    mac = hmac.new(key.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{mac}"
```

### Pass the token to CheerpX

Add the token to `bridgeURL` as the `token` query parameter:

`<script>window.onload = (event) => { ppInit({ bridgeURL: "wss://myWebsocketServer.mydomain.com/?token=TOKEN_FROM_YOUR_SERVER" }) }</script>`

The bridge checks the token only when the connection opens, so a token only needs to stay valid until the page has loaded the Flash content. Connections with a missing, invalid or expired token are rejected with HTTP status 403.

---

To read more about Docker, take a look at their official docs [here](https://docs.docker.com/).

To read more about Websockets, take a look at Mozilla's documentation [here](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).
