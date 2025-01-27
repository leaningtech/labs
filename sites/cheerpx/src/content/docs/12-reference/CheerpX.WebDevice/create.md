---
title: create
description: Create a CheerpX WebDevice instance, representing a read-only HTTP-based filesystem for CheerpX.
---

```ts
namespace CheerpX {
	class WebDevice {
		static async create(
			path: string
		): Promise<WebDevice>;
	}
}
```

## Parameters

- **path (`string`)** - The path to the local directory you want to mount.

## Returns

`CheerpX.WebDevice.create` returns a [Promise] that gives you a WebDevice instance. You can use this instance to mount the specified directory in the CheerpX filesystem.

## Example

Create a `webDevice` instance for the `/webdevice` directory.

```js
// Add a device to expose a directory on the HTTP server in the VM
const webDevice = await CheerpX.WebDevice.create("/webdevice");

// Initialize the CheerpX environment
const mountPoints = [
  // Mount the WebDevice to a known location
  { type: "dir", path: "/webdevice", dev: webDevice },  
];
const cx = await CheerpX.Linux.create({
  mounts: mountPoints,
});
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
