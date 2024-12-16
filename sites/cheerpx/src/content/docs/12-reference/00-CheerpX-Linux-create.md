---
title: CheerpX.Linux.create
description: Create a CheerpX application instance
---

```ts
namespace CheerpX {
	class Linux {
		static async create(options?: {
			mounts?: MountPointConfiguration[];
			networkInterface?: NetworkInterface;
		}): Promise<CheerpX.Linux>;
	}
}

interface MountPointConfiguration {
	// Specifies the filesystem type
	// 'ext2' for Linux ext2
	// 'dir' for a hierarchical file system
	// 'devs' for device files
	// 'proc' for process info files.
	type: "ext2" | "dir" | "devs" | "proc";

	// First mount must be "/" (root)
	path: string;
	// Can be one of: overlayDevice / webDevice / dataDevice / idbDevice
	dev: CheerpX.Device;
}

interface NetworkInterface {
	authKey?: string;
	controlUrl?: string;
	loginUrlCb?: (url: string) => void;
	stateUpdateCb?: (state: number) => void;
	netmapUpdateCb?: (map: any) => void;
}
```

## Parameters

- **options (`object`, _optional_)** - Used to configure different settings of the CheerpX Linux environment. This object may include settings for mounts, network interfaces, and other features, structured as `{ option: "value" }`.

## Returns

`CheerpX.Linux.create` returns a [Promise] which is resolved once the CheerpX Linux environment is fully initialized and ready to use. The resolved value is a `CheerpX.Linux` instance that provides methods for interacting with the CheerpX environment.

## Options

A description of each `CheerpX.Linux.create` option with brief examples are given below.

### `mounts`

```ts
mounts?: MountPointConfiguration[];
```

This option configures the filesystems that will be available in the CheerpX environment. Each mount point configures a device and specifies where it should be accessible within the virtual filesystem.

Example:

```js
const cx = await CheerpX.Linux.create({
	mounts: [
		{ type: "ext2", path: "/", dev: overlayDevice },
		{ type: "dir", path: "/app", dev: webDevice },
	],
});
```

> [!note] Note
> CheerpX supports a variety of backends, designed to provide access to HTTP resources, IndexedDB-base persistent storage and data from JavaScript. Complete Ext2 filesystems are also supported on top of block devices. For detailed information, including usage examples and full APIs, please refer to the [Files and filesystems](/docs/guides/File-System-support) guide.

### `networkInterface`

```ts
networkInterface?: NetworkInterface;
```

This option configures network settings, which allows CheerpX to communicate over networks. For more detailed information about how CheerpX handles networking, including the use of Tailscale and overcoming browser limitations, see the [Networking](/docs/guides/Networking) guide.

### `authKey`

```ts
authKey?: string;
```

The `authKey` is an optional string used for authentication. It is usually taken from the URL, allowing the CheerpX Linux environment to be set up automatically without the user needing to enter it manually.

**Example of usage:**

```js
let authKey = undefined;
if (browser) {
	let params = new URLSearchParams("?" + window.location.hash.substr(1));
	authKey = params.get("authKey") || undefined;
}
const networkInterface = { authKey };
```

**Explanation**

1. The `authKey` is taken from the URL, allowing the application to automatically use the authentication key provided by the browser.

2. The `authKey` is added to the `networkInterface` object, ensuring the application can access the authentication data whenever needed in the CheerpX environment.

### `controlUrl`

```ts
controlUrl?: string;
```

The `controlUrl` is an optional string parameter representing a URL used to manage or monitor the connection. It is typically fetched from the URL parameters and can be utilized for dashboard or configuration purposes.

**Example of usage:**

```js
let controlUrl = undefined;
if (browser) {
	let params = new URLSearchParams("?" + window.location.hash.substr(1));
	controlUrl = params.get("controlUrl") || undefined;
}
const dashboardUrl = controlUrl
	? null
	: "https://login.tailscale.com/admin/machines";
const networkInterface = { controlUrl };
```

**Explanation**

1. The `controlUrl` is taken from the URL and added to the `networkInterface` object, making it easy to connect to the appropriate control dashboard.

2. If `controlUrl` isn’t provided, the app automatically uses a default URL (`dashboardUrl`) for monitoring or setup.

### `loginUrlCb`

```ts
loginUrlCb?: (url: string) => void;
```

The `loginUrlCb` is a callback function designed to handle login URLs during the authentication process. It plays a critical role in the connection flow by setting the application's state to indicate readiness for login and resolving the URL required for the login process.

**Example of usage:**

```js
function loginUrlCb(url) {
	connectionState.set("LOGINREADY");
	resolveLogin(url);
}
```

**Explanation**

1. **State update**

- The function updates the connectionState writable store to "LOGINREADY", signaling that the system is prepared for the user to initiate the login process.

```js
connectionState.set("LOGINREADY");
```

2. **URL resolution**

- The callback resolves the `loginPromise` with the provided URL. This promise is awaited during the login initiation process (`startLogin`) to fetch and use the login URL.

```js
resolveLogin(url);
```

**How it works**

The `loginUrlCb` is part of the `networkInterface` object, which organizes the key callbacks and functions for managing the network state. It interacts with:

- `startLogin`: The function that initiates the login process. It depends on the `loginUrlCb` to resolve the login URL and update networkData.

```js
export async function startLogin() {
	connectionState.set("LOGINSTARTING");
	const url = await loginPromise; // Waits for `loginUrlCb` to resolve the URL.
	networkData.loginUrl = url; // Stores the resolved URL for application-wide access.
	return url;
}
```

### StateUpdateCb

```ts
stateUpdateCb?: (state: number) => void;
```

This callback function is invoked whenever the connection state changes, enabling you to react dynamically to transitions such as connecting, disconnecting, or successfully establishing a connection. The `state` parameter is an integer representing the current state.

**Example of usage:**

```js
function stateUpdateCb(state) {
	switch (state) {
		case 6: // Running
			connectionState.set("CONNECTED");
			break;
		default:
			connectionState.set("DISCONNECTED");
	}
}
```

**Explanation**

- **State** `6` (Running): The callback sets the application's `connectionState` to `"CONNECTED"`, indicating the system is online.
- **Other states**: The default case handles all non-running states, setting `connectionState` to `"DISCONNECTED"`.

**How it works**

The `stateUpdateCb` is part of the `networkInterface` object and is triggered internally during connection events. It enables you to synchronize the application's user interface or internal state with the current connection status.

### NetmapUpdateCb

```ts
netmapUpdateCb?: (map: any) => void;
```

This callback is triggered whenever the network map is updated. The `map` parameter contains the full network configuration, including information about the current IP address and peers.

**Example of usage:**

```ts
function netmapUpdateCb(map) {
	networkData.currentIp = map.self.addresses[0];
	var exitNodeFound = false;
	for (var i = 0; i < map.peers.length; i++) {
		if (map.peers[i].exitNode) {
			exitNodeFound = true;
			break;
		}
	}
	if (exitNodeFound) {
		exitNode.set(true);
	}
}
```

**Explanation**

**IP address update**: Updates `networkData.currentIp` with the first address of the current device.

**Exit node detection**: Iterates through `map.peers` to determine if an exit node exists in the network and updates the `exitNode` writable store to `true` if an exit node is found, otherwise sets it to `false`.

**How it works**

The `netmapUpdateCb` interacts with the network map provided by the CheerpX environment. It ensures that the current IP and exit node status is kept up to date with the latest network configuration.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
