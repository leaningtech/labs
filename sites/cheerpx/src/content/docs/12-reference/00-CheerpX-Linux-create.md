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

The `authKey` is an optional string used for authentication and should be passed directly in the `create` call.

**Example of usage:**

```js

```

**Explanation**

### `controlUrl`

```ts
controlUrl?: string;
```

The `controlUrl` is an optional string used to specify the URL of a self-hosted server.

**Example of usage:**

```js

```

**Explanation**

### `loginUrlCb`

```ts
loginUrlCb?: (url: string) => void;
```

The `loginUrlCb` is a callback function designed to handle login URLs during the authentication process. It plays a critical role in the connection flow by setting the application's state to indicate readiness for login and resolving the URL required for the login process.

**Example of usage:**

```js

```

**Explanation**

### StateUpdateCb

```ts
stateUpdateCb?: (state: number) => void;
```

This callback function is invoked whenever the connection state changes, enabling you to react dynamically to transitions such as connecting, disconnecting, or successfully establishing a connection. The `state` parameter is an integer representing the current state.

**Example of usage:**

```js

```

**Explanation**

### NetmapUpdateCb

```ts
netmapUpdateCb?: (map: any) => void;
```

This callback is triggered whenever the network map is updated. The `map` parameter contains the full network configuration, including information about the current IP address and peers.

**Example of usage:**

```ts

```

**Explanation**

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
