---
title: CheerpXApp#setConsole
---

Sets up an HTML element to be used as the console for the application. The element will be focused and styled.

```ts
class CheerpXApp {
	setConsole(element: HTMLElement): void;
}
```

## Example

```html {1,4}
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpXApp.create(/* ... */);
	cx.setConsole(document.getElementById("console"));
</script>
```

## See also

If you'd prefer to capture output yourself, use [`setCustomConsole`](/docs/reference/CheerpXApp-setCustomConsole).
