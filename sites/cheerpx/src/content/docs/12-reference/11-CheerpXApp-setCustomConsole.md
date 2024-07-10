---
title: CheerpXApp#setCustomConsole
---

```ts
class CheerpXApp {
	setCustomConsole(
		writeFunc: (buf: Buffer) => void,
		cols: number,
		rows: number,
	): (keyCode: number) => void;
}
```

## Returns

`setCustomConsole` returns a function that you can use to send individual keypresses to the console, as if a user typed them.

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
	60,
);

// Send a string
for (let i = 0; i < "Hello, world!".length; i++) {
	send("Hello, world!".charCodeAt(i));
}
send(0x000d); // Carriage return (Enter)
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
	term.rows,
);
term.onData((str) => {
	for (let i = 0; i < str.length; i++) {
		send?.(str.charCodeAt(i));
	}
});
```

This is what [WebVM](https://webvm.io) uses.

## See also

- [`setConsole`](/docs/reference/CheerpXApp-setConsole)
