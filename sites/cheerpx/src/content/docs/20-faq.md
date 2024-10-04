---
title: Frequently Asked Questions
---

## 1. How can I capture stdout from a program running in CheerpX?

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
