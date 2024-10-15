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
    <script>
      let consoleOutput = '';

      // Function to capture output from C++
      window.setConsoleOutput = (output) => {
        consoleOutput += output;
        document.getElementById('console').textContent = consoleOutput; // Display in the console element
      };

      // Initialize CheerpX
      const cx = await CheerpX.Linux.create();
      cx.setConsole(document.getElementById("console")); // Set the console element
    </script>
```

For more details on customizing the console, see [CheerpX Custom console].

## Reading files using IDBDevice.readFileAsBlob

`IDBDevice` provides a persistent, read-write filesystem using the browser’s IndexedDB. It’s ideal for storing data that should persist between sessions. You can use the `readFileAsBlob` method to read files from an IDBDevice as Blob objects.

If the file you want to read is not yet in an `IDBDevice`, you can copy files by running commands inside the virtual machine to make them accessible. For example:

```js
await cx.run("cp", ["Source_file", "Destination_file"]);
```

For more on IDBDevice operations, see the [CheerpX IDBDevice].

## Accessing JS Data in the Filesystem via DataDevice

The `DataDevice` in CheerpX exposes JavaScript data in the filesystem. This device provides read-only access to `Uint8Array`s and JavaScript `Strings`s. It is particularly useful for transferring data from JavaScript to programs running in CheerpX.

For more information, see the [CheerpX DataDevice].

## Capture stdout from a program running in CheerpX

Currently, CheerpX doesn't directly support capturing stdout from running programs. However, there's a workaround that allows you to capture the output, albeit with some limitations.

### Workaround: Redirecting to a File

You can redirect the output of a program to a file and then read that file from JavaScript. Here's how:

1. Make sure to mount an IDBDevice for a writable and JavaScript-accessible file storage

```js
const filesDevice = await CheerpX.IDBDevice.create("files");
const cx = await CheerpX.Linux.create({
	mounts: [
		// This example assumes using `overlayDevice` as the root, please adapt accordingly to your needs
		{ type: "ext2", path: "/", dev: overlayDevice },
		{ type: "dir", path: "/files", dev: filesDevice },
	],
});
```

2. Run your program using `bash -c`, redirecting stdout to a file:

```js
await cx.run("/bin/bash", [
	"-c",
	"echo 'Output to capture' > /files/output.txt",
]);
```

3. After the program finishes, read the contents of the file using JavaScript:

```javascript
const outputBlob = await filesDevice.readFileAsBlob("/output.txt");
console.log(await outputBlob.text());
```

### Limitation

This method has a significant limitation: it doesn't provide streaming output. The entire program needs to finish execution before you can read the output file. This means you won't see real-time output, and for long-running programs, you'll have to wait until completion to see any results.

[CheerpX documentations]: https://cheerpx.io/docs/overview
[CheerpX console]: https://cheerpx.io/docs/reference/CheerpX-Linux-setConsole
[CheerpX Custom console]: https://cheerpx.io/docs/reference/CheerpX-Linux-setCustomConsole
[CheerpX DataDevice]: https://cheerpx.io/docs/guides/File-System-support#datadevice
[CheerpX IDBDevice]: https://cheerpx.io/docs/guides/File-System-support#idbdevice
[Frequently Asked Questions]: https://cheerpx.io/docs/faq
[xterm.js]: https://xtermjs.org/
