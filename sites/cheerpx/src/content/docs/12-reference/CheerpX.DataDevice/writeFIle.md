---
title: writeFile
description: Write data to a new file in the CheerpX DataDevice.
---

```ts
namespace CheerpX {
	class DataDevice {
		async writeFile(
			filename: string,
			contents: string | Uint8Array
		): Promise<void>;
	}
}
```

## Parameters

- **filename (`string`)** - The path to the file within the device, starting with a `/` (e.g., `/filename`). The path should not include the mount point.
- **contents (`string | Uint8Array`)** - The data to write to the file. Can be either a string or a `Uint8Array`.

## Returns

`CheerpX.DataDevice.writeFile` returns a [Promise] that resolves when the file has been created and written to, but it does not return any value.

## Example

Write a file to the `DataDevice`.

```ts {29}
// Create a read-only block device for a disk image stored on the HTTP server
const blockDevice = await CheerpX.HttpBytesDevice.create("/cheerpXImage.ext2");
// Make the block device read-write using a persistent IndexedDB overlay
const idbDevice = await CheerpX.IDBDevice.create("block_cpp");
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
	// Add the required Linux pseudo-filesystem
	{ type: "devs", path: "/dev" },
	{ type: "devpts", path: "/dev/pts" },
	{ type: "proc", path: "/proc" },
];
const cx = await CheerpX.Linux.create({
	mounts: mountPoints,
});

// Setup the text console
cx.setConsole(document.getElementById("console"));

async function compileAndRun(cx, dataDevice, srcCode, inputName, outputName) {
	// Make the source code available as a file
	await dataDevice.writeFile("/" + inputName, srcCode);
	// Compile the source code by calling g++
	await cx.run(
		"/usr/bin/g++",
		["-v", "/data/" + inputName, "-o", "/" + outputName],
		{
			env: ["PATH=/usr/bin"],
		}
	);
	await cx.run("/" + outputName, []);
}

const srcCode = `
#include <iostream>

int main()
{
    std::cout << "Hello World" << std::endl;
    return 0;
}
`;
await compileAndRun(cx, dataDevice, srcCode, "hello.cpp", "hello");
```

In this example:

The `writeFile` method is used to write source code (`srcCode`) into a file (`hello.cpp`) on the `DataDevice`.

After that, the CheerpX environment runs a `g++` command to compile the source code, and then executes the compiled file to output __Hello World__.

If you’d like to learn more about related topics, check out these guides:

- [Files and filesystems](/docs/guides/File-System-support) – Managing files and storage in CheerpX.
- [Custom disk images](/docs/guides/custom-images) – Creating and using custom disk images.
- [Input and output](/docs/guides/input-output) – Handling data flow in your environment.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
