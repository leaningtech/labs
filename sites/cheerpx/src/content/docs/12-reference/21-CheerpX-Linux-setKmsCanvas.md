---
title: CheerpX.Linux#setKmsCanvas
Description: Configure the KMS canvas for rendering graphical output in a CheerpX Linux instance.
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

- **canvas: HTMLCanvasElement** - The <canvas> element in your HTML document that serves as the rendering surface. This is where graphical output is displayed.

- **width: number** - The width of the canvas in pixels.

- **height: number** - The height of the canvas in pixels.

## Description

The `setKmsCanvas` method configures a kernel-mode setting (KMS) canvas, enabling the CheerpX Linux instance to render graphical. The dimensions of the canvas are defined by the `width` and `height` parameters, allowing the application to adapt to different display sizes dynamically.

## Example

```ts
function setScreenSize(display) {
    // Determine scaling factor
    let scaleFactor = 1.0;
    const displayWidth = display.offsetWidth;
    const displayHeight = display.offsetHeight;

    // Define minimum width and height for the canvas
    const minWidth = 1024;
    const minHeight = 768;

    // Adjust scale factor if the display is smaller than the minimum
    if (displayWidth < minWidth) {
        scaleFactor = minWidth / displayWidth;
    }
    if (displayHeight < minHeight) {
        scaleFactor = Math.max(scaleFactor, minHeight / displayHeight);
    }

    // Configure the KMS canvas
    cx.setKmsCanvas(display, displayWidth * scaleFactor, displayHeight * scaleFactor);
}

// Example: Setting up the canvas in a web application
const canvasElement = document.getElementById("display");
setScreenSize(canvasElement);
```

