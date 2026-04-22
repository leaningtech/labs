---
title: WebVM
description: Linux running client-side within your browser tab.
demo_url: https://webvm.io/
repository_url: https://github.com/leaningtech/webvm
author: Leaning Technologies
project_type: Company Demo
niche: Virtual Machines
tags:
  - CheerpX
hero_image: "./webvm.png"
---

## What is WebVM?

WebVM is a virtual Linux environment running in the browser via WebAssembly. It is powered by the CheerpX virtualization engine, which enables safe, sandboxed, client-side execution of x86 binaries. Being built entirely on standard web technologies — WebAssembly in particular — it is fully isolated from your system and your other browser tabs.

## How it works

CheerpX includes an x86-to-WebAssembly JIT compiler, a virtual block-based file system, and a Linux syscall emulator. Together, these components make it possible to run unmodified Linux software directly inside a browser tab.

## Claude Integration

WebVM integrates the Computer Use feature from Claude. Since Claude APIs can be used directly from a browser tab, it is possible to combine them with WebVM to create a secure and private environment to experiment with Claude Computer Use capabilities. Read more about the WebVM and Claude integration in our dedicated [blog post](https://cheerpx.io/blog/webvm-claude).
