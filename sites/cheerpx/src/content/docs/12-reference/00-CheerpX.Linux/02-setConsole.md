---
title: setConsole
description: Configure an HTML element as the console output for CheerpX Linux applications
---

```ts
namespace CheerpX {
	class Linux {
		setConsole(element: HTMLElement): void;
	}
}
```

## Parameters

- **element (`HTMLElement`)** - The HTML element that will display the console output from the CheerpX Linux application. This element will be styled and focused to act as the terminal.

## Returns

`setConsole` does not return a value.

## Example

```html {1,4}
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpX.Linux.create(/* ... */);
	cx.setConsole(document.getElementById("console"));
</script>
```
