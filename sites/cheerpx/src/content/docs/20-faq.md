---
title: Frequently Asked Questions
---

## How can I capture stdout from a program running in CheerpX?

Currently, CheerpX doesn't directly support capturing stdout from running programs. However, there's a workaround that allows you to capture the output, albeit with some limitations.

### Workaround: Redirecting to a File

You can redirect the output of a program to a file and then read that file from JavaScript. Here's how:

1. Run your program using `bash -c`, redirecting stdout to a file:

```js
await cx.run(["bash", "-c", "your_executable > output.txt"]);
```

2. After the program finishes, read the contents of the file using JavaScript:

```javascript
const output = await cx.readFile("output.txt");
console.log(output);
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
