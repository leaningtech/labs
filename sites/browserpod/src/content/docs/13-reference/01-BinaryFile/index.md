---
title: BinaryFile
description: Binary data, ArrayBuffer, and the BinaryFile API
---

`BinaryFile` handles are returned by `createFile(path, "binary")` and `openFile(path, "binary")`.

## What “binary” means here

In BrowserPod, **binary** does *not* mean “executable program.” It simply means **raw bytes** — data that is not plain text.

Examples of binary data:
- Images (PNG, JPG)
- Zip files
- PDFs
- Wasm files
- Any file you download from the internet that isn’t plain text

## What is an ArrayBuffer?

An **ArrayBuffer** is JavaScript’s standard container for raw bytes. It is the browser’s way of holding binary data in memory.

Think of it like a box of bytes:
- Text files → strings
- Binary files → ArrayBuffer

## Why BrowserPod uses ArrayBuffer

BrowserPod runs in the browser, so it uses the browser’s native binary format (`ArrayBuffer`) for file data. That keeps things fast and compatible with browser APIs like `fetch`, `Response.arrayBuffer()`, and file uploads.

## BinaryFile vs TextFile

When you create or open a file, you choose a mode:

- **TextFile**: use when you want to read/write strings (like `.js` or `.json`).
- **BinaryFile**: use when you want to read/write raw bytes (like images or ZIPs).

### Example: writing text

```ts
const file = await pod.createFile('/project/readme.txt', 'text');
await file.write('Hello BrowserPod');
await file.close();
```

### Example: writing binary

```ts
const file = await pod.createFile('/project/image.png', 'binary');
const resp = await fetch('/image.png');
const bytes = await resp.arrayBuffer();
await file.write(bytes);
await file.close();
```
