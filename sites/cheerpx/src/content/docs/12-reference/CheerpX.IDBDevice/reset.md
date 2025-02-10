---
title: reset
description: Reset the IDBDevice instance, clearing all its stored data in the associated IndexedDB.
---

```ts
namespace CheerpX {
	class IDBDevice {
		async reset(): Promise<void>;
	}
}
```

## Parameters

None.

## Returns

`CheerpX.IDBDevice.reset` returns a [Promise] that resolves once the `IDBDevice` has been reset. This operation clears all stored data, effectively restoring the `IDBDevice` to an empty state.

## Example

Reset an `IDBDevice` instance before mounting it.

```ts
// Create a read-only block device for a disk image stored on the HTTP server
const blockDevice = await CheerpX.HttpBytesDevice.create("/cheerpXImage.ext2");

// Make the block device read-write using a persistent IndexedDB overlay
const idbDevice = await CheerpX.IDBDevice.create("block_bash");

// Reset the IndexedDB storage
await idbDevice.reset();

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
