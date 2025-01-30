---
title: create
description: Create a CheerpX IDBDevice instance to store data in the browser's IndexedDB with read and write access.
---

```ts
namespace CheerpX {
	class IDBDevice {
		static async create(dbName: string): Promise<IDBDevice>;
	}
}
```

## Parameters

- **dbName (`string`)** - The name of `IndexedDB` where the filesystem will be stored.

## Returns

`CheerpX.IDBDevice.create` returns a [Promise] that gives you an `IDBDevice` instance. You can use this instance to create a virtual filesystem stored in `IndexedDB` within your CheerpX environment.

## Example

Create an `IDBDevice` instance for persistent storage.

```js {4}
// Create a read-only block device for a disk image stored on the HTTP server
const blockDevice = await CheerpX.HttpBytesDevice.create("/cheerpXImage.ext2");
// Make the block device read-write using a persistent IndexedDB overlay
const idbDevice = await CheerpX.IDBDevice.create("block_idbDevice");
const overlayDevice = await CheerpX.OverlayDevice.create(
	blockDevice,
	idbDevice
);
// Initialize the CheerpX environment
const mountPoints = [
	// Use the disk image as the filesystem root
	{ type: "ext2", path: "/", dev: overlayDevice },
];
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
});
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
