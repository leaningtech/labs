---
title: setKmsCanvas
description: Configure the KMS canvas for rendering graphical output in a CheerpX Linux instance.
---

```ts
namespace CheerpX {
	class Linux {
		setKmsCanvas(
			canvas: HTMLCanvasElement,
			width: number,
			height: number
		): void;
	}
}
```

## Parameters

- **canvas (`HTMLCanvasElement`)** - The `canvas` element in your HTML document that serves as the rendering surface. This is where graphical output is displayed.

- **width (`number`)** - The desired width of the canvas in pixels.

- **height (`number`)** - The desired height of the canvas in pixels.

## Returns

`setKmsCanvas` does not return a value.

## Description

The `setKmsCanvas` method configures a kernel-mode setting (KMS) canvas, enabling the CheerpX Linux instance to render graphical output, for example via Xorg. The dimensions of the canvas are defined by the `width` and `height` parameters, allowing the application to adapt to different display sizes dynamically.

## Example

```ts
function setScreenSize(display) {
	const displayWidth = display.offsetWidth;
	const displayHeight = display.offsetHeight;

	cx.setKmsCanvas(display, displayWidth, displayHeight);
}

// Set up the canvas in a web application
const canvasElement = document.getElementById("display");
setScreenSize(canvasElement);
```
