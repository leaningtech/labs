---
title: create
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
```

## Parameters

- **options (`object`, _optional_)** - Used to configure different settings of the CheerpX Linux environment. This object may include settings for mounts, network interfaces, and other features, structured as `{ option: "value" }`.

## Returns

`CheerpX.Linux.create` returns a [Promise] which is resolved once the CheerpX Linux environment is fully initialized and ready to use. The resolved value is a `CheerpX.Linux` instance that provides methods for interacting with the CheerpX environment.

Additionally, this instance allows you to register and monitor system events, such as CPU and disk activity. For more details, see the [`event callbacks`](/docs/reference/CheerpX.Linux/event%20callbacks) page.

## Options

A description of each `CheerpX.Linux.create` option with brief examples are given below.

### `mounts`

```ts
mounts?: MountPointConfiguration[];
```

This option configures the filesystems that will be available in the CheerpX environment. Each mount point configures a device and specifies where it should be accessible within the virtual filesystem.

Each mount configuration must follow this structure:

```ts
interface MountPointConfiguration {
	// Specifies the filesystem type
	// 'ext2' for Linux ext2
	// 'dir' for a hierarchical file system
	// 'devs' for device files (no device required)
	// 'proc' for process info files. (no device required)
	type: "ext2" | "dir" | "devs" | "proc";

	// First mount must be "/" (root)
	path: string;
	// Required for 'ext2' and 'dir' types, but optional for 'devs' and 'proc'
	dev?: CheerpX.Device;
}
```

Example:

```js
const cx = await CheerpX.Linux.create({
	mounts: [
		{ type: "ext2", path: "/", dev: overlayDevice },
		{ type: "dir", path: "/app", dev: webDevice },
		{ type: "devs", path: "/dev" }, // No dev required
		{ type: "proc", path: "/proc" }, // No dev required
	],
});
```

> [!note] Note
> CheerpX supports a variety of backends, designed to provide access to HTTP resources, IndexedDB-based persistent storage and data from JavaScript. Complete Ext2 filesystems are also supported on top of block devices. For detailed information, including usage examples and full APIs, please refer to the [Files and filesystems](/docs/guides/File-System-support) guide.

### `networkInterface`

```ts
networkInterface?: NetworkInterface;
```

Configures networking for CheerpX. Accepts either a Tailscale configuration object or a custom network implementation.

**Tailscale configuration:**

```ts
interface NetworkInterface {
	authKey?: string; // Pre-authentication key for Tailscale
	controlUrl?: string; // URL for self-hosted Headscale server
	loginUrlCb?: (url: string) => void; // Callback for interactive login
	stateUpdateCb?: (state: number) => void; // Connection state changes
	netmapUpdateCb?: (map: any) => void; // Network configuration updates
}
```

**Properties:**

- **`authKey`** - Authentication key for registering pre-authenticated users or devices. Generate one at [Tailscale admin](https://login.tailscale.com/admin/settings/keys).
- **`controlUrl`** - URL of a self-hosted Headscale server (optional).
- **`loginUrlCb`** - Callback that receives the login URL for interactive Tailscale authentication.
- **`stateUpdateCb`** - Callback invoked when connection state changes (e.g., state `6` indicates connected).
- **`netmapUpdateCb`** - Callback invoked when network configuration updates, provides network details.

**Custom network implementation:**

For advanced use cases, pass an object implementing these methods:

- `TCPSocket(remoteAddress, remotePort)` - Create TCP client socket
- `TCPServerSocket(localAddress, options)` - Create TCP server socket
- `UDPSocket(options)` - Create UDP socket (optional, can return `null`)
- `up()` - Initialize network interface

**See also:**

- [Networking guide](/docs/guides/Networking) - Detailed Tailscale setup, examples, and troubleshooting
- [Custom Networking guide](/docs/guides/Custom-Networking) - Complete custom implementation guide with example code

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
