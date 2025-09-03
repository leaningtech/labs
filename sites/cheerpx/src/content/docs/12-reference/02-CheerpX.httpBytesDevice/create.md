---
title: create
description: Create a CheerpX HttpBytesDevice instance to stream disk blocks via HTTP.
---

```ts
namespace CheerpX {
	class HttpBytesDevice {
		static async create(url: string): Promise<HttpBytesDevice>;
	}
}
```

## Parameters

- **url (`string`)** - The URL of the disk image to be streamed via HTTP.

## Returns

`CheerpX.HttpBytesDevice.create` returns a [Promise] that resolves to an `HttpBytesDevice` instance. You can use this instance to mount a remote `ext2` filesystem in your CheerpX environment.

## Example

Create an `HttpBytesDevice` instance for remote filesystem streaming.

```ts {2, 6, 12}
// Create a read-only block device for a disk image stored on an HTTP server
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

In this example, the `HttpBytesDevice` is created using `CheerpX.HttpBytesDevice.create()` and used as the base layer for an ext2 filesystem in the CheerpX system.

To learn more about virtual filesystems in CheerpX, check out our [Files and filesystems](/docs/guides/File-System-support) guide.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
