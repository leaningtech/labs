---
title: Input and output
description: Techniques for getting data in and out of the CheerpX virtual machine
---

## CheerpX console input and output

CheerpX provides two options for handling console input and output: a _built-in_ console and a _custom_ console. The purpose of the console is to interact with the running application via standard input and output.

### Built-in console

CheerpX comes with a _built-in_ console that mimics traditional console behavior. The _built-in_ console supports standard input and output over a HTML `<pre>` (pre-formatted) element. Keyboard input works provided the element is in focus.

For more information, visit the [CheerpX console] reference.

### Custom console

CheerpX also supports a _custom_ console that allows developers to programmatically capture output and provide input. This feature is useful to integrate with a more complete terminal implementation such as [xterm.js]. We use xterm.js ourselves for our public WebVM environment.

Another possible use for the custom console is accumulating program output into a JavaScript string. You can achieve this with the following snippet:

```js
const encoder = new TextEncoder("utf-8");

let accumulatedOutput = ""; // Initialize an empty string to accumulate output

const send = cx.setCustomConsole((buf) => {
	const string = new TextDecoder("utf-8").decode(buf);
	accumulatedOutput += string; // Accumulate the output
	console.log(accumulatedOutput); // log the accumulated output
});

// Send a string
const str = "Hello, custom console!\n";
const encodedStr = encoder.encode(str);

for (let i = 0; i < encodedStr.length; i++) {
	send(encodedStr[i]);
}
```

For more details on customizing the console, see [CheerpX Custom console].

## Reading Files Using IDBDevice and Redirecting Output

[`IDBDevice`](/docs/reference/CheerpX.IDBDevice) provides a persistent, read-write filesystem using the browser’s IndexedDB. It’s ideal for storing data that should persist between sessions. You can use the [`readFileAsBlob`](/docs/reference/CheerpX.IDBDevice/readFileAsBlob) method to read files from an [`IDBDevice`](/docs/reference/CheerpX.IDBDevice) as Blob objects.

To make a file accessible, you can copy files using commands within the virtual machine. Here’s an example on how to do it:

```js
const filesDevice = await CheerpX.IDBDevice.create("files");
const cx = await CheerpX.Linux.create({
	// Mount the IDBDevice
	mounts: [
		{ type: "ext2", path: "/", dev: overlayDevice },
		{ type: "dir", path: "/files", dev: filesDevice },
	],
});
```

Now, you can copy files as follows:

```js
await cx.run("/bin/cp", ["/source_file", "/destination_file"]);
```

### Redirecting Output to a File

To capture output from a program, you can redirect it to a file. Here’s how to do that:

1. Run your program using `bash -c`, redirecting stdout to a file:

```js
await cx.run("/bin/bash", ["-c", "echo 'Output to capture' > /output.txt"]);
```

2. Read the Output File:

After the program finishes, you can read the contents of the output file:

```js
const outputBlob = await filesDevice.readFileAsBlob("/output.txt");
console.log(await outputBlob.text());
```

> [!note] Note
> This method has a significant limitation: it doesn't provide streaming output. The entire program needs to finish execution before you can read the output file. This means you won't see real-time output, and for long-running programs, you'll have to wait until completion to see any results. For real-time output, consider using the _custom_ console approach, which allows for streaming output.

## Accessing JS Data in the Filesystem via DataDevice

The `DataDevice` API exposes JavaScript data via the filesystem. This device provides read-only access to a `Uint8Array` and a JavaScript `String`. It is particularly useful for transferring data from JavaScript to programs running in CheerpX.

For more information, see the [CheerpX DataDevice].

[CheerpX documentations]: https://cheerpx.io/docs/overview
[CheerpX console]: https://cheerpx.io/docs/reference/CheerpX-Linux-setConsole
[CheerpX Custom console]: https://cheerpx.io/docs/reference/CheerpX-Linux-setCustomConsole
[CheerpX DataDevice]: https://cheerpx.io/docs/guides/File-System-support#datadevice
[Frequently Asked Questions]: https://cheerpx.io/docs/faq
[xterm.js]: https://xtermjs.org/
