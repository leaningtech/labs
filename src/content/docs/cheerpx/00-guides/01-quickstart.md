---
title: Quickstart
subtitle: Getting started with CheerpX
---

This guide is a bare-minimum overview of how to start building with CheerpX.

## 1. Include the CheerpX library on your page

```html
<script src="https://cheerpxdemos.leaningtech.com/publicdeploy/cx.js"></script>
```

## 2. Create a CheerpX instance

CheerpX's API lives in a global object called `CheerpXApp`. To create a CheerpX instance, call its `create` method.

```html
<script type="module">
	const cx = await CheerpXApp.create();
</script>
```

## 3. Enable cross-origin isolation

CheerpX requires [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), which requires the site to be cross-origin isolated. To enable cross-origin isolation, set the following COOP/COEP HTTP headers:

```yaml
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

<!-- TODO: link to a guide on how to set headers in various environments -->

## 4. Attach a console

### As an HTML element

Use the `setConsole` method to use an HTML element as a console.

```html
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpXApp.create();
	cx.setConsole(document.getElementById("console"));
</script>
```

### Custom console

If you'd prefer to capture output yourself, you can use `setCustomConsole` instead:

```js
const decoder = new TextDecoder("utf-8");
cx.setCustomConsole(
	(buffer) => {
		const string = decoder.decode(buffer);
		console.log(string);
	},
	40, // rows
	60, // columns
);
```

This is currently the only way to get output from commands. In the future, we'll add support for reading stdout/stderr directly.

## 5. Run an executable

Let's compile a simple C program to x86 and run it.

```c
#include <stdio.h>

int main() {
  printf("Hello, world!\n");
  return 0;
}
```

<!-- TODO: do something else because this doesnt work on macos -->

```bash
gcc -m32 hello.c -o hello
```

```html
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpXApp.create();
	cx.setConsole(document.getElementById("console"));

	const exitCode = await cx.run("/hello", []);
	console.log("hello exited with code", exitCode);
</script>
```

## 6. Run a full operating system

Running C/C++ code in the browser is [already possible](/cheerp), though, so let's try something more interesting. Let's run a full operating system in the browser!

```js
const cx = await CheerpXApp.create({
	devices: [
		{
			type: "block",
			url: "https://disks.webvm.io/debian_large_20230522_5044875331.ext2",
			name: "block1",
		},
	],
	mounts: [
		{ type: "ext2", dev: "block1", path: "/" },
		{ type: "cheerpOS", dev: "/app", path: "/app" },
		{ type: "cheerpOS", dev: "/str", path: "/data" },
		{ type: "devs", dev: "", path: "/dev" },
	],
});

await cx.run("/bin/bash", ["-c", "echo Hello, world!"]);
```

## 7. Send some input

`setCustomConsole` returns a function that you can use to send keypresses to the console. To send an entire string, you can do something like this:

```js
const pressKey = cx.setCustomConsole(
	(buffer) => {
		const string = decoder.decode(buffer);
		console.log(string);

		// When the REPL is ready, send some input
		if (string.includes(">>>")) {
			const stdin = "print('Hello from Python!')";
			for (let i = 0; i < stdin.length; i++) {
				pressKey(stdin.charCodeAt(i));
			}
			pressKey(0x000d); // Carriage return (Enter)
		}

		// End the REPL once it prints "Hello from Python!"
		if (string.includes("Hello from Python!")) {
			pressKey(0x0004); // End of transmission (Ctrl+D)
		}
	},
	rows,
	cols,
);

const exitCode = await cx.run("/usr/bin/python3");
console.log("python3 exited with code", exitCode);
```

## Next steps

Check out the [API Reference](/cheerpx/reference).
