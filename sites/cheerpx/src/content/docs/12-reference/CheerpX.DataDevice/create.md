---
title: create
description: Create a CheerpX DataDevice instance to store temporary data in memory.
---

```ts
namespace CheerpX {
	class DataDevice {
		static async create(): Promise<DataDevice>;
	}
}
```

## Parameters

- None

## Returns

`CheerpX.DataDevice.create` returns a [Promise] that resolves to a `DataDevice` instance. You can use this instance to create a temporary in-memory filesystem in your CheerpX environment.

## Example

Create a `DataDevice` instance for in-memory storage.

```ts {7, 13}
// Create a read-only block device for a disk image stored on the HTTP server
const blockDevice = await CheerpX.HttpBytesDevice.create("/cheerpXImage.ext2");
// Make the block device read-write using a persistent IndexedDB overlay
const idbDevice = await CheerpX.IDBDevice.create("block_idbDevice");
const overlayDevice = await CheerpX.OverlayDevice.create(
	blockDevice,
	idbDevice
);
// Add a device to expose JavaScript data in the VM
const dataDevice = await CheerpX.DataDevice.create();
// Initialize the CheerpX environment
const mountPoints = [
	// Use the disk image as the filesystem root
	{ type: "ext2", path: "/", dev: overlayDevice },
	// Add the DataDevice to a known location
	{ type: "dir", path: "/data", dev: dataDevice },
];
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
});
```

In this example, the `DataDevice` is created using `CheerpX.DataDevice.create()` and mounted at `/data` in the Linux environment inside the CheerpX system.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
