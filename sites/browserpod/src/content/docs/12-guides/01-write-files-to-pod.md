---
title: Write files to the pod
description: How to write text, binary files, and full projects into a pod
---

This page explains how to write files into the BrowserPod filesystem using the API. It covers:

- Creating project folders
- Copying a full project
- Writing text files
- Writing binary files

## 1) Create the `/project` folder

Pods start with a minimal filesystem, so create a project directory first:

```ts
await pod.createDirectory("/project");
```

If you need intermediate folders, pass `{ recursive: true }`.

## 2) Copy a whole project into a pod

A common pattern is to keep your runnable project inside your web app (for example in `public/project/`), then copy those files into `/project` at runtime:

```ts
async function copyFile(pod, path) {
	const f = await pod.createFile("/" + path, "binary");
	const resp = await fetch(path);
	const buf = await resp.arrayBuffer();
	await f.write(buf);
	await f.close();
}

await pod.createDirectory("/project");
await copyFile(pod, "project/main.js");
await copyFile(pod, "project/package.json");
```

## 3) Write a text file

Text files are for plain text (ASCII or UTF-8), such as `.js`, `.json`, `.txt`, `.md`, and `.csv`.

```ts
const file = await pod.createFile("/project/main.js", "utf-8");
await file.write("console.log('Hello BrowserPod')");
await file.close();
```

## 4) Write a binary file

Binary files are for raw bytes like images, ZIPs, PDFs, or Wasm files.

```ts
const file = await pod.createFile("/project/image.png", "binary");
const resp = await fetch("/image.png");
const bytes = await resp.arrayBuffer();
await file.write(bytes);
await file.close();
```

## 5) Write text as binary (optional)

If you prefer to write text as raw bytes, encode the string and pass an `ArrayBuffer`:

```ts
const content = "console.log('Hello BrowserPod')
";
const encoder = new TextEncoder();
const encoded = encoder.encode(content);
const buffer = encoded.buffer.slice(
  encoded.byteOffset,
  encoded.byteOffset + encoded.byteLength
);

const file = await pod.createFile('/project/main.js', 'binary');
await file.write(buffer);
await file.close();
```
