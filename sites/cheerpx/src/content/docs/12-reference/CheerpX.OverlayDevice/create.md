---
title: create
description: Create a writable persistent overlay device on top of another block device.
---

```ts
namespace CheerpX {
	class OverlayDevice {
		static async create(
			baseDevice: Device,
			overlayDevice: Device
		): Promise<OverlayDevice>;
	}
}
```

## Parameters

- **baseDevice (`Device`)** - The underlying device (e.g., `HttpBytesDevice`, `IDBDevice`) that serves as the base layer for the filesystem.

- **overlayDevice (`Device`)** - The writable layer that will overlay the base device, enabling persistent changes.

## Returns

`CheerpX.OverlayDevice.create` returns a [Promise] that resolves to an instance of the `OverlayDevice`. The `OverlayDevice` allows you to overlay a writable layer on top of the base device, enabling persistent changes while still accessing the base data.

## Example

Create an `OverlayDevice` instance to combine a `HttpBytesDevice` for streaming data from an HTTP source and an `IDBDevice` for caching and persistent local storage.

```ts {8, 12}
// Create a read-only HttpBytesDevice for streaming disk blocks via HTTP
const httpDevice = await CheerpX.HttpBytesDevice.create("/cheerpXImage.ext2");

// Create an IDBDevice for local persistent storage
const idbDevice = await CheerpX.IDBDevice.create("block_idbDevice");

// Create an OverlayDevice to combine the two devices
const overlayDevice = await CheerpX.OverlayDevice.create(httpDevice, idbDevice);

// Mount the overlay device in the CheerpX environment as an ext2 filesystem
const cx = await CheerpX.Linux.create({
	mounts: [{ type: "ext2", path: "/", dev: overlayDevice }],
});
```

In this example, the `OverlayDevice` provides a writable layer on top of the `HttpBytesDevice` (which serves as a read-only block device for streaming), allowing changes to be stored locally via the `IDBDevice`.

<!-- Add links when rest of the references are added -->
<!-- ## Related sources

- [Cheerp.HttpBytesDevice.create]()
- [Cheerp.IDBDevice.create]()
- [Cheerp.Linux.create]() -->

For more information, please check out the [Files and File system guide](/docs/guides/File-System-support). This guide provides more details on how to work with files and directories in CheerpX.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
