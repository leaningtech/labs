---
title: Frequently Asked Questions
---

## How can I capture stdout from a program running in CheerpX?

Currently, CheerpX doesn't directly support capturing stdout from running programs. However, there's a workaround that allows you to capture the output, albeit with some limitations.

### Workaround: Redirecting to a File

You can redirect the output of a program to a file and then read that file from JavaScript. Here's how:

1. Make sure to mount an IDBDevice for a writable and JavaScript accessible file storage

```
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
await cx.run("/bin/bash", ["-c", "echo 'Output to capture' > /files/output.txt"]);
```

3. After the program finishes, read the contents of the file using JavaScript:

```javascript
const outputBlob = await filesDevice.readFileAsBlob("/output.txt");
console.log(await outputBlob.text());
```

### Limitation

This method has a significant limitation: it doesn't provide streaming output. The entire program needs to finish execution before you can read the output file. This means you won't see real-time output, and for long-running programs, you'll have to wait until completion to see any results.

## Why can't CheerpX find files in my device?

When using WebDevice, keep in mind:

1. WebDevice uses absolute paths from the root of the mounted directory.
2. Do not include the first slash `/` of the path.
3. The path is relative to the root of the mounted WebDevice, not the current working directory.

### Debugging Path Issues

Use browser's DevTools:

1. Open DevTools (F12 or right-click and "Inspect").
2. Go to "Network" tab.
3. Filter for your application's requests.
4. Look for 404 (Not Found) errors.
5. Check the full URL of these 404 requests to see the exact path CheerpX is trying to access.

## Why can't I execute files directly from a DataDevice?

DataDevice in CheerpX is write-only. This means you can write data to it, but you cannot execute files directly from it. To execute files that are in a DataDevice, you need to first copy the files to a writable filesystem, such as an IDB (IndexedDB) or ext2 filesystem.

## Can I use third-party origins with WebDevice?

Yes, WebDevice can handle third-party origins as paths, but it's important to consider the implications of Cross-Origin Resource Sharing (CORS) when doing so. To ensure smooth functioning, the server hosting these third-party resources must have the appropriate CORS headers configured. If the CORS settings are not properly arranged, browsers might block these requests to third-party resources, which can lead to files being inaccessible in CheerpX.

## Why can't CheerpX do what v86 does in terms of disk access and networking?

CheerpX's architecture and use case differ significantly from v86, which affects how it handles disk access and networking:

### Disk Access

CheerpX is powered by an extremely sophisticated JIT engine, which allows it to support large disk images (up to 2GB at the time). This means we cannot simply download the entire disk image before starting execution, as v86 might do for smaller images. Instead, CheerpX uses a chunk-based, on-demand downloading system.

We acknowledge that some users may experience slower disk access. Our team is actively investigating these issues and working on optimizations to enhance performance across all use cases.

### Networking

While v86 might use an open proxy to the internet, this approach is not feasible for CheerpX due to its scale of use. An open proxy can pose significant security risks when used at scale.

Instead, CheerpX supports Tailscale-based networking, which can accommodate many use cases. It's important to note that developers using CheerpX are responsible for implementing appropriate security measures and preventing potential abuse.
