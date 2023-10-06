---
title: cheerpjCreateDisplay
description: Display GUI elements
---

`cheerpjCreateDisplay` adds an element to the DOM which will be used for graphical rendering.

```ts
function cheerpjCreateDisplay(
	width: number,
	height: number,
	parent?: HTMLElement,
): HTMLElement;
```

## Parameters

- `width`: The width of the display area in CSS pixels, or `-1` to match parent width.
- `height`: The height of the display area in CSS pixels, or `-1` to match parent height.
- `parent` (optional): Element to add display as a child of.

## Returns

`cheerpjCreateDisplay` returns the [HTMLElement] that it created.

## Examples

### Create a display

```js
cheerpjCreateDisplay(800, 600);
```

This creates a 800x600 display for rendering, and appends it to the document body.

### Take up the whole page

```js
cheerpjCreateDisplay(-1, -1, document.body);
```

This creates a display that takes up the whole page, and responds to changes in the page size.

### Usage with React

```jsx
import { useRef, useEffect } from "react";

function Display({ width, height }) {
	const parent = useRef();
	useEffect(() => {
		cheerpjCreateDisplay(width, height, parent);
	});
	return <div ref={parent} />;
}
```

[HTMLElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
