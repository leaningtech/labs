---
title: Custom Networking
description: Implementing a custom network interface for CheerpX
---

CheerpX allows you to provide your own networking implementation instead of using the default Tailscale-based networking stack. This advanced feature gives you full control over how network connections are established and managed within your CheerpX environment.

## Overview

By default, CheerpX uses [Tailscale](/docs/guides/Networking) for networking, which provides VPN capabilities via WebSockets. However, if you want to use a custom proxy solution or implement your own networking layer, you can pass a custom network interface object to `CheerpX.Linux.create()`.

This feature is designed for developers with networking expertise who need specific networking configurations beyond what Tailscale provides.

## Using a custom network interface

To use a custom networking implementation, pass your network interface class instance as the `networkInterface` option:

```js
const cx = await CheerpX.Linux.create({
	mounts: [
		// your mount points
	],
	networkInterface: new CustomNetworkInterface(),
});
```

## Interface specification

Your custom networking implementation should follow the [Direct Sockets API](https://wicg.github.io/direct-sockets/) conventions with one key difference: instead of constructing socket objects using `new`, CheerpX calls methods on your interface object to create sockets.

Your network interface class should implement the following methods:

### Required methods

#### `TCPSocket(remoteAddress, remotePort)`

Creates a TCP client socket for connecting to a remote server.

**Parameters:**

- `remoteAddress` (string): The IP address or hostname to connect to
- `remotePort` (number): The port number to connect to

**Returns:** An object with the following properties:

- `opened` (Promise): Resolves when the connection is established, providing connection info including `readable`, `writable`, `remoteAddress`, `remotePort`, `localAddress`, and `localPort`
- `closed` (Promise): Resolves when the connection is closed
- `close` (function): Method to close the connection

#### `TCPServerSocket(localAddress, options)`

Creates a TCP server socket that listens for incoming connections.

**Parameters:**

- `localAddress` (string): The local IP address to bind to
- `options` (object): Configuration options
  - `localPort` (number): The port number to listen on

**Returns:** An object with the following properties:

- `opened` (Promise): Resolves immediately with server info including `readable`, `localAddress`, and `localPort`
- `closed` (Promise): Resolves when the server is closed
- `close` (function): Method to close the server

The `readable` stream yields accepted client connections.

#### `UDPSocket(options)`

Creates a UDP socket for datagram communication.

**Parameters:**

- `options` (object): Configuration options for the UDP socket

**Returns:** An object following the same pattern as TCP sockets, or `null` if UDP is not implemented.

> [!note] Note
> UDP socket implementation is optional. If your use case doesn't require UDP, you can return `null` from this method.

#### `up()`

Called to initialize or bring up the network interface.

**Returns:** A Promise that resolves when the network interface is ready.

## Example implementation

Below is a basic example implementing TCP server and client functionality. This implementation uses in-memory streams to demonstrate the interface structure:

```js
class TCPClient {
	constructor(readable, writable, opened, closed) {
		this.readable = readable;
		this.writable = writable;
		this.opened = opened;
		this.closed = closed;
	}

	async _close() {
		await this.readable.cancel();
		this.closed.resolve();
	}
}

class TCPServer {
	constructor(readable) {
		this.readable = readable;
		this.closed = Promise.withResolvers();
	}

	async _close() {
		await this.readable.cancel();
		this.closed.resolve();
	}
}

class AcceptQueue {
	constructor() {
		this.queue = [];
		this.waitingResolver = null;
	}

	async pop() {
		let p;
		if (this.queue.length === 0) {
			p = await new Promise((resolve) => {
				this.waitingResolver = resolve;
			});
		} else {
			p = this.queue.shift();
		}
		if (p.open) {
			p.open();
		}
		return p.o;
	}

	push(o, open) {
		let p = { o, open };
		if (this.waitingResolver) {
			this.waitingResolver(p);
			this.waitingResolver = null;
		} else {
			this.queue.push(p);
		}
	}
}

class CustomNetworkInterface {
	constructor(options) {
		this.listeners = [];
	}

	cross_streams() {
		let trans1 = new TransformStream();
		let trans2 = new TransformStream();
		let opened = Promise.withResolvers();
		let closed = Promise.withResolvers();
		let s1 = new TCPClient(
			trans1.readable,
			trans2.writable,
			opened,
			closed,
		);
		let s2 = new TCPClient(
			trans2.readable,
			trans1.writable,
			opened,
			closed,
		);
		return [s1, s2];
	}

	makeTCPSocket(client, localAddress, localPort, remoteAddress, remotePort) {
		let readable = client.readable;
		let writable = client.writable;
		let openInfo = {
			readable,
			writable,
			remoteAddress,
			remotePort,
			localAddress,
			localPort,
		};
		let opened = client.opened.promise.then(() => {
			return openInfo;
		});
		let closed = client.closed.promise;
		let close = client._close.bind(client);
		return { opened, closed, close };
	}

	makeTCPServerSocket(s, localAddress, localPort) {
		let readable = s.readable;
		let openInfo = { readable, localAddress, localPort };
		let opened = Promise.resolve(openInfo);
		let closed = s.closed.promise;
		let close = s._close.bind(s);
		return { opened, closed, close };
	}

	TCPSocket(remoteAddress, remotePort) {
		let addr = { addr: remoteAddress, port: remotePort };
		let listener = this.listeners.find((item) => {
			return (
				item.addr.addr === addr.addr && item.addr.port === addr.port
			);
		});
		if (!listener) {
			let opened = Promise.reject();
			let closed = Promise.reject();
			let close = () => {};
			return { opened, closed, close };
		}
		let [s1, s2] = this.cross_streams();
		let localAddress = "0.0.0.0";
		let localPort = 1000;
		let ret = this.makeTCPSocket(
			s1,
			localAddress,
			localPort,
			remoteAddress,
			remotePort,
		);
		let paired = this.makeTCPSocket(
			s2,
			remoteAddress,
			remotePort,
			localAddress,
			localPort,
		);
		listener.queue.push(paired, s1.opened.resolve);
		return ret;
	}

	TCPServerSocket(localAddress, options) {
		let localPort = options.localPort;
		let addr = { addr: localAddress, port: localPort };
		let newQueue = new AcceptQueue();
		this.listeners.push({ addr: addr, queue: newQueue });
		let readable = new ReadableStream({
			async pull(controller) {
				let newS = await newQueue.pop();
				if (newS) {
					controller.enqueue(newS);
				}
			},

			cancel: () => {
				newQueue.push(null, null);
				let idx = this.listeners.findIndex((item) => {
					return (
						item.addr.addr === addr.addr &&
						item.addr.port === addr.port
					);
				});
				this.listeners.splice(idx, 1);
			},
		});
		let s = new TCPServer(readable);
		let ret = this.makeTCPServerSocket(s, localAddress, localPort);
		return ret;
	}

	UDPSocket(options) {
		// Not implemented for this example
		return null;
	}

	up() {
		return Promise.resolve();
	}
}
```

## Key considerations

### Implementation notes

- The example above implements an in-memory connection system where clients and servers connect through internal streams
- In a real-world implementation, you would typically integrate with WebSocket proxies, WebRTC data channels, or other browser-compatible transport mechanisms
- Your implementation must handle the asynchronous nature of network connections using Promises

### Use cases

Custom networking implementations are useful when:

- You have an existing proxy infrastructure you want to leverage
- You need to implement specific security or authentication requirements
- You want to route traffic through custom gateways or load balancers
- Your application requires specialized networking protocols or configurations

### Limitations

Remember that browsers impose fundamental networking restrictions:

- Direct TCP/UDP socket access is not available in standard web contexts
- You'll need to work within browser-provided APIs (WebSockets, WebRTC, etc.)
- CORS policies still apply to HTTP-based transports

## Further reference

For detailed information about the `networkInterface` parameter and its type signature, see the [`CheerpX.Linux.create()`](/docs/reference/CheerpX.Linux/create#networkinterface) reference documentation.

For information about the default Tailscale-based networking, see the [Networking](/docs/guides/Networking) guide.

For more details on the Direct Sockets API that inspired this interface design, refer to the [Direct Sockets specification](https://wicg.github.io/direct-sockets/).
