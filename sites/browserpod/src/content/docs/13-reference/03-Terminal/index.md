---
title: Terminal
description: A handle to a terminal emulator running inside a Pod
---

A `Terminal` is a handle to a terminal emulator running inside a [Pod](/docs/reference/BrowserPod). It is created by [`createDefaultTerminal`](/docs/reference/BrowserPod/createDefaultTerminal) or [`createCustomTerminal`](/docs/reference/BrowserPod/createCustomTerminal), and passed to [`run`](/docs/reference/BrowserPod/run) to connect a process to I/O.

```ts
class Terminal {
	write(data: string | Uint8Array): void;
}
```

## Creating a Terminal

- [`createDefaultTerminal`](/docs/reference/BrowserPod/createDefaultTerminal) creates an [Xterm.js](https://xtermjs.org/)-based terminal attached to a DOM element.
- [`createCustomTerminal`](/docs/reference/BrowserPod/createCustomTerminal) creates a headless terminal with a custom `onOutput` callback.

## Usage

```ts
const terminal = await pod.createDefaultTerminal(element);
await pod.run("node", ["script.js"], { terminal });
```

## Writing to a terminal

`write` sends text or bytes directly to the terminal's output, without going through a process in the Pod. Running processes do not receive it as input. Use it to show your own messages alongside program output, such as the command about to run:

```ts
terminal.write("$ npm install\r\n");
await pod.run("npm", ["install"], { terminal });
```
