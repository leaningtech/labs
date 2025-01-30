---
title: readFileAsBlob
description: Reads a file from an IDBDevice and returns it as a Javascript Blob object.
---

```js
namespace CheerpX {
  class IDBDevice {
    async readFileAsBlob(filename: string): Promise<Blob>;
  }
}
```

## Parameters

- **filename (`string`)** - The path to the file within the `IDBDevice`, starting with a `/` (e.g., “/filename”). Do not include the mount point.

## Returns

`CheerpX.IDBDevice.readFileAsBlob` returns a [Promise] that resolves to a Javascript `Blob` object. This object represents the file's data, which can be further manipulated or converted as needed.

## Example

```js {4, 15}
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

const outputBlob = await idbDevice.readFileAsBlob("/fileName");
console.log(outputBlob);
```

> [!tip] View stored files in DevTools
> To see your stored files, open Developer Tools, go to the Application tab, and check storage > IndexedDB. Here, you can browse and inspect your files easily!

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
