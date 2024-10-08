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

This option configures network settings, which allows CheerpX to communicate over networks.

## Event callbacks

The `CheerpX.Linux` instance returned by `create` provides methods to register and unregister callbacks to monitor CPU and disk activity, as well as disk latency.

### `registerCallback`

```ts
registerCallback(eventName: string, callback: (state: string | number) => void): void
```

Registers a callback function for a specific event type.

**Parameters**:

- **eventName**: A string specifying the event type. Can be `"cpuActivity"`, `"diskActivity"`, or `"diskLatency"`.
- **callback**: A function that will be called when the event occurs. It receives a parameter which varies based on the event type:
  - For `"cpuActivity"` and `"diskActivity"`: `state` can be either "ready" (active) or "wait" (idle).
  - For `"diskLatency"`: `state` is a number representing the time in milliseconds between requesting and receiving the last disk block.

### `unregisterCallback`

```ts
unregisterCallback(eventName: string, callback: (state: string | number) => void): void
```

Unregisters a previously registered callback function for a specific event type.

**Parameters**:

- **eventName**: A string specifying the event type. See the `registerCallback` reference above for the supported event types.
- **callback**: The function to be unregistered.

Example usage:

```js
function hddCallback(state) {
	var h = document.getElementById("hddactivity");
	if (state == "ready") h.textContent = "\u{1F7E2}";
	else h.textContent = "\u{1F7E0}";
}

function cpuCallback(state) {
	var h = document.getElementById("cpuactivity");
	if (state == "ready") h.textContent = "\u{1F7E2}";
	else h.textContent = "\u{1F7E0}";
}

function latencyCallback(latency) {
	console.log(`Last disk block download latency: ${latency}ms`);
}

const cx = await CheerpX.Linux.create(/* options */);

cx.registerCallback("cpuActivity", cpuCallback);
cx.registerCallback("diskActivity", hddCallback);
cx.registerCallback("diskLatency", latencyCallback);

// Later, if needed:
// cx.unregisterCallback("cpuActivity", cpuCallback);
// cx.unregisterCallback("diskActivity", hddCallback);
// cx.unregisterCallback("diskLatency", latencyCallback);
```

This example demonstrates how to register callbacks for CPU activity, disk activity, and disk latency. The CPU and disk activity callbacks update UI elements based on the activity state, while the disk latency callback logs the latency of the last downloaded disk block.

> [!note] Note
> The `diskLatency` event works for any type of network block device and provides real-time information about the latency of disk block downloads.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
