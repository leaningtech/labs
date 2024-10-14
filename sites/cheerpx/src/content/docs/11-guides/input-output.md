---
title: input and output CheerpX
description: Summarization on how to get data in and out of CheerpX VM
---

## CheerpX console input and output

CheerpX provides two options for handling console input and output: the `built-in` console and a `custom` console. The purpose of these consoles are to interact with the running application, execute commands and, view output. The custom console allows you to create an interface that fits the specific needs of your application.

**Built-in console**

The CheerpX VM comes with a `built-in` console that mimics traditional console behavior. The `built-in` console in CheerpX allows for standard input and output operations, similar to typical command-line environments. You can use standard I/O functions like printf and scanf within your C/C++ programs.

For more information, visit the [CheerpX console].

**Custom console**

CheerpX also supports a `custom` console that allows developers to capture output programmatically. This feature enables you to accumulate program output into a JavaScript string. You can implement your `custom` logging mechanism to redirect the output to a variable, which can be manipulated or displayed as needed.

For more details on customizing the console, see [CheerpX Custom console].

## Reading Data from the Filesystem using IDBDevice.readFileAsBlob

`IDBDevice` provides a persistent, read-write filesystem using the browser’s IndexedDB. It’s ideal for storing data that should persist between sessions. You can use the `readFileAsBlob` method to read files from an IDBDevice as Blob objects.

You can copy files from various filesystems into the `IDBDevice`. This allows you to make these files accesible.

For more on IDBDevice operations, see the [CheerpX IDBDevice].

## Accessing JS Data in the Filesystem via DataDevice

The `DataDevice` in CheerpX allows access to JavaScript data in the filesystem. This device can interact with data stored in memory or other JavaScript objects. It is particularly useful for transferring data between JavaScript and the compiled C/C++ code.

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
