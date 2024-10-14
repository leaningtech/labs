---
title: Input and output
description: Techniques for getting data in and out of CheerpX virtual machine
---

## CheerpX console input and output

CheerpX provides two options for handling console input and output: the _built-in_ console and a _custom_ console. The purpose of the console is to interact with the running application via standard input and output.

### Built-in console

CheerpX comes with a _built-in_ console that mimics traditional console behavior. The _built-in_ console in CheerpX allows for standard input and output operations, similar to typical command-line environments. You can use standard I/O functions like printf and scanf within your C/C++ programs.

For more information, visit the [CheerpX console] reference.

### Custom console

---

CheerpX also supports a _custom_ console that allows developers to capture output, and provide input, programmatically. This feature is useful to integrate with a more complete terminal implementation such as [xterm.js]. We use xterm.js ourselves for our public WebVM environment.

Another possible use for the custom console it accumulating program output into a JavaScript string. You can achieve this with the following snippet:

[ADD CODE]

---

For more details on customizing the console, see [CheerpX Custom console].

## Reading Data from the Filesystem using IDBDevice.readFileAsBlob

`IDBDevice` provides a persistent, read-write filesystem using the browser’s IndexedDB. It’s ideal for storing data that should persist between sessions. You can use the `readFileAsBlob` method to read files from an IDBDevice as Blob objects.

---

If the file you want to read is not yet in an `IDBDevice`, you can copy files by running commands inside the virtual machine to make them accessible.

[ADD AN EXAMPLE]

---

For more on IDBDevice operations, see the [CheerpX IDBDevice].

## Accessing JS Data in the Filesystem via DataDevice

The `DataDevice` in CheerpX allows access to JavaScript data from the filesystem. This device can read-only access to `Uint8Array`s and JavaScript `Strings`s. It is particularly useful for transferring data from JavaScript to processes running in CheerpX.

For more information, see the [CheerpX DataDevice].

## Capture stdout from a program running in CheerpX

Currently, CheerpX doesn't directly support capturing stdout from running programs. Therefore, The IDBDevice allows you to use `.readFileAsBlob()` for capturing stdout after redirecting stdout to a file in `bash`. You can then read this file as a Blob.

For more information on capturing stdout, see [Frequently Asked Questions].

[WebVM]: https://webvm.io/
[PythonFiddle]: https://pythonfiddle.leaningtech.com/#A4JwlgdgLgFARACQKYBsUHsAEB1dIUAmAhHAJQBQQA
[CheerpX documentations]: https://cheerpx.io/docs/overview
[CheerpX console]: https://cheerpx.io/docs/reference/CheerpX-Linux-setConsole
[CheerpX Custom console]: https://cheerpx.io/docs/reference/CheerpX-Linux-setCustomConsole
[CheerpX DataDevice]: https://cheerpx.io/docs/guides/File-System-support#datadevice
[CheerpX IDBDevice]: https://cheerpx.io/docs/guides/File-System-support#idbdevice
[Frequently Asked Questions]: https://cheerpx.io/docs/faq
[xterm.js]: https://xtermjs.org/
