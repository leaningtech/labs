---
title: Terminal
description: A handle to a terminal emulator running inside a Pod
---

A `Terminal` is an opaque handle to a terminal emulator running inside a [Pod](/docs/reference/browserpod/). It is created by [`createDefaultTerminal`](/docs/reference/browserpod/createDefaultTerminal/) or [`createCustomTerminal`](/docs/reference/browserpod/createCustomTerminal/), and passed to [`run`](/docs/reference/browserpod/run/) to connect a process to I/O.

```ts
class Terminal {}
```

## Creating a Terminal

- [`createDefaultTerminal`](/docs/reference/browserpod/createDefaultTerminal/) creates an [Xterm.js](https://xtermjs.org/)-based terminal attached to a DOM element.
- [`createCustomTerminal`](/docs/reference/browserpod/createCustomTerminal/) creates a headless terminal with a custom `onOutput` callback.

## Usage

```ts
const terminal = await pod.createDefaultTerminal(element);
await pod.run("node", ["script.js"], { terminal });
```
