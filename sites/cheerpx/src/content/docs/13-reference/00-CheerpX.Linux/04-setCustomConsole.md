---
title: setCustomConsole
description: Configure custom console behavior for handling keyboard input and output display
---

```ts
namespace CheerpX {
	class Linux {
		setCustomConsole(
			writeFunc: (buf: Uint8Array, vt: number) => void,
			cols: number,
			rows: number
		): (keyCode: number) => void;
	}
}
```

## Parameters

- **writeFunc (`(buf: Uint8Array, vt: number) => void`)** - Function to handle the output sent to the console.
- **cols (`number`)** - Number of columns for the console.
- **rows (`number`)** - Number of rows for the console.

## Returns

`setCustomConsole` returns a function of type `(keyCode: number) => void`. This function should be called to simulate user input by sending key codes to the console.

## Examples

### Read and write strings

```js
const decoder = new TextDecoder("utf-8");

const send = cx.setCustomConsole(
	(buf) => {
		const string = decoder.decode(buf);
		console.log(string);
	},
	40,
	60
);

// Send a string
const str = "Hello, world!\n";
for (let i = 0; i < str.length; i++) {
	send(str.charCodeAt(i));
}
```

### Use with [Xterm.js](https://xtermjs.org/)

```js
const term = new Terminal({ convertEol: true });
term.open(document.getElementById("terminal"));

const send = cx.setCustomConsole(
	(buf) => {
		term.write(new Uint8Array(buf));
	},
	term.cols,
	term.rows
);
term.onData((str) => {
	for (let i = 0; i < str.length; i++) {
		send(str.charCodeAt(i));
	}
});
```
