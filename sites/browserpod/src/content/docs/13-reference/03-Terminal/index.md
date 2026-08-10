---
title: Terminal
description: A handle to a terminal emulator running inside a Pod
---

A `Terminal` is an opaque handle to a terminal emulator running inside a [Pod](/docs/reference/BrowserPod). It is created by [`createDefaultTerminal`](/docs/reference/BrowserPod/createDefaultTerminal) or [`createCustomTerminal`](/docs/reference/BrowserPod/createCustomTerminal), and passed to [`run`](/docs/reference/BrowserPod/run) to connect a process to I/O.

```ts
class Terminal {}
```

## Creating a Terminal

- [`createDefaultTerminal`](/docs/reference/BrowserPod/createDefaultTerminal) creates an [Xterm.js](https://xtermjs.org/)-based terminal attached to a DOM element.
- [`createCustomTerminal`](/docs/reference/BrowserPod/createCustomTerminal) creates a headless terminal with a custom `onOutput` callback.

## Usage

```ts
const terminal = await pod.createDefaultTerminal(element);
await pod.run("node", ["script.js"], { terminal });
```
