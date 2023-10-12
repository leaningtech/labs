---
title: cheerpjCreateDisplay
subtitle: Display GUI elements
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

- **width (`number`)** - The width of the display area in CSS pixels, or `-1` to match parent width.
- **height (`number`)** - The height of the display area in CSS pixels, or `-1` to match parent height.
- **parent (`HTMLElement`, _optional_)** - Element to add display as a child of.

## Returns

`cheerpjCreateDisplay` returns an [`HTMLElement`] representing the created display.

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

[`HTMLElement`]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
