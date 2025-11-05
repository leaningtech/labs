---
title: createDefaultTerminal
description: Create an Xterm.js-based terminal emulator for input/output
---

```ts
class BrowserPod {
	async createDefaultTerminal(
		consoleDiv: HTMLElement,
	): Promise<Terminal>;
}
```

## Parameters

- **consoleDiv (`HTMLElement`)** - An HTML element where the terminal will be created.

## Returns

`createDefaultTerminal` returns a [Promise] which is resolved when the terminal has been created.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
