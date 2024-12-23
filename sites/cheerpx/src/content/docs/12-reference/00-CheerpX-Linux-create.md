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

The `authKey` is a string containing an authentication key for registering pre-authenticated users or devices. You can generate one [here](https://login.tailscale.com/admin/settings/keys).

Example:

```js
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
	networkInterface: { authKey: "YOUR KEY" },
});
```

### `controlUrl`

```ts
controlUrl?: string;
```

The `controlUrl` is an optional string used to specify the URL of a [self-hosted Headscale server](/docs/guides/Networking#self-hosting-headscale).

Example:

```js
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
	networkInterface: { controlUrl: "YOUR URL" },
});
```

### `loginUrlCb`

```ts
loginUrlCb?: (url: string) => void;
```

The `loginUrlCb` is a callback function that handles login URLs during the authentication process. It receives the URL that should be visited to continue the login process. This is necessary when authenticating with Tailscale.

Example:

```js
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
	networkInterface: { loginUrlCb },
});

function loginUrlCb(url) {
	console.log("Login URL is ready:", url);
	// Open the login URL in a new tab or window
	window.open(url, "_blank");
}
```

### stateUpdateCb

```ts
stateUpdateCb?: (state: number) => void;
```

The `stateUpdateCb` is a callback that runs when the connection state changes. The `state` parameter represents the connection status.

Example:

```js
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
	networkInterface: { stateUpdateCb },
});

function stateUpdateCb(state) {
	if (state === 6) {
		console.log("Connected");
	}
}
```

### netmapUpdateCb

```ts
netmapUpdateCb?: (map: any) => void;
```

The `netmapUpdateCb` is a callback that runs whenever the network configuration updates. It provides details about the current network configuration.

Example:

```ts
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
	networkInterface: { netmapUpdateCb },
});

function netmapUpdateCb(map) {
	const currentIp = map.self.addresses[0];
	console.log(`Current IP: ${currentIp}`);
}
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
