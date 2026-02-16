---
title: Syscalls
description: What system calls are and how BrowserPod uses them
---

BrowserPod runs Node.js inside the browser, so it cannot call your computer’s operating system directly. Instead, it uses a Linux-like syscall layer provided by **CheerpOS**.

## What is a syscall?

A **system call (syscall)** is how a program asks an operating system to do something privileged, like:

- Open or write a file
- Create a directory
- Read the clock
- Open a network socket

In normal Node.js, these requests go to the host OS (macOS, Windows, Linux). In BrowserPod, they go to a **virtual syscall layer** implemented in the browser.

## How syscalls work in BrowserPod

1. Your code calls a built-in API (like `fs.readFile` or `http.createServer`).
2. The runtime you've selected (e.g., Node, Python) translates that into syscalls (open, read, write, listen, etc.).
3. CheerpOS intercepts those syscalls and fulfills them inside the browser using its virtual filesystem and networking layer.

So the Node runtime *thinks* it’s talking to Linux, but the work is actually done by the BrowserPod runtime in the browser.

- **Most standard Node APIs work** because they map cleanly to the virtual syscall layer.
- **Native binaries can fail** because they expect a real OS kernel, not a virtual one.
- **File access is sandboxed** to the Pod’s virtual filesystem, not your computer’s disk.
