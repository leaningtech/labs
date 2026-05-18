---
title: createCustomTerminal
description: Create a custom terminal emulator with specified dimensions and output handling
---

```ts
class BrowserPod {
	createCustomTerminal(opts: {
		cols?: number;
		rows?: number;
		onOutput: (buffer: Uint8Array | ArrayBuffer, vt?: unknown) => void;
	}): Promise<Terminal>;
}
```

## Parameters

- **opts (object)** - Terminal configuration options passed as an object.

## Options

- **cols (`number`, _optional_)** - The number of columns (width) for the terminal display. If not specified, a default width will be used.
- **rows (`number`, _optional_)** - The number of rows (height) for the terminal display. If not specified, a default height will be used.
- **onOutput** (`function(buffer: Uint8Array | ArrayBuffer, vt?: unknown) => void`) - Callback function invoked whenever the terminal produces output. The buffer contains the raw terminal data, and vt contains optional VT escape sequence information.

## Returns

`createCustomTerminal` returns a [Promise] which is resolved when the terminal has been created successfully. The promise resolves to a `Terminal` object that can be used to interact with the custom terminal.

## Notes

The `onOutput` callback is required and will be called each time data is written to the terminal. This allows you to process or display terminal output as needed.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
