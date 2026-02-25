---
title: Library mode
description: Use Java libraries in JavaScript
---

Library mode allows you to directly use Java methods, objects, and arrays from JavaScript. This API has been designed to take advantage of async/await to feel more natural to use, without sacrificing any flexibility.

## Getting started

Loading a library is as simple as calling [`cheerpjRunLibrary`].

- `await cheerpjRunLibrary("")` loads **only the Java standard library**
- `await cheerpjRunLibrary("/app/path/to/some.jar")` loads the Java standard library **plus** all the classes in the JAR

An example of using the standard Java library.

First, we’ll initialize CheerpJ and write a simple program in a JavaScript file using **library mode** to call a few Java standard library classes.

```js title="script.js"
await cheerpjInit();

// Create a library mode object
const lib = await cheerpjRunLibrary(""); // "" means standard library only

// Resolve the Java classes we are going to use
const ArrayList = await lib.java.util.ArrayList;
const Point = await lib.java.awt.Point;
const System = await lib.java.lang.System;

// Create a new list object
const points = await new ArrayList();

// Create 4 point objects
for (let i = 0; i < 4; i++) {
    // Allocate the point
    const p = await new Point(i, 0);

    // Add the point to the list
    await points.add(p);
}

// Convert to list to an Object[] array
const a = await points.toArray();

// Iterate on the array and set y = x
for (let i = 0; i < a.length; i++) {
    // Fields can be read and written directly
    a[i].y = a[i].x;
}

// Convert all the elements to Strings
for (let i = 0; i < a.length; i++) {
    // Java arrays can be read and written directly
    a[i] = await a[i].toString();
}

// Print them out
for (let i = 0; i < a.length; i++) {
    // Static fields can be accessed too
    await System.out.println(a[i]);
}

```

Then, we’ll include that script from a minimal HTML page and run it in the browser. The output will be printed to the browser console.

```html title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>CheerpJ Library mode (Standard library)</title>

		<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
	</head>

	<body>
    <h1>Library mode – Standard library</h1>
		<p>Open the browser console to view the output.</p>

		<script type="module" src="./script.js"></script>
	</body>
</html>
```

## Example: generating a PDF with iText

Library mode can be used to integrate powerful Java libraries into your Web application. As a practical example, these few lines of code make it possible to generate a PDF from JavaScript using the popular iText library.

**This example:**

- Loads `itextpdf-5.5.13.3.jar`
- Builds a PDF and writes it to `/files/HelloIText.pdf`
- Reads it back as a blob and shows it in the page

First, in `script.js`, we initialize CheerpJ, load the iText JAR in library mode, and use iText to create a simple “Hello World” PDF written to `/files/HelloIText.pdf`. We then read the file back as a blob and convert it to an object URL.

```js title="script.js"
const statusEl = document.getElementById("status");
const pdfDisplay = document.getElementById("pdfDisplay");

document.getElementById("makePdf").addEventListener("click", async () => {
  statusEl.textContent = "Initializing CheerpJ…";
  await cheerpjInit();

  statusEl.textContent = "Loading iText library…";
  const lib = await cheerpjRunLibrary("/app/itextpdf-5.5.13.jar");

  try {
    const Document = await lib.com.itextpdf.text.Document;
    const Paragraph = await lib.com.itextpdf.text.Paragraph;
    const PdfWriter = await lib.com.itextpdf.text.pdf.PdfWriter;
    const FileOutputStream = await lib.java.io.FileOutputStream;

    const document = await new Document();
    const writer   = await PdfWriter.getInstance(
      document,
      await new FileOutputStream("/files/HelloIText.pdf")
    );

    await document.open();
    await document.add(await new Paragraph("Hello World!"));
    await document.close();
    await writer.close();

    const blob = await cjFileBlob("/files/HelloIText.pdf");
    const url  = URL.createObjectURL(blob);
    pdfDisplay.src = url;
    statusEl.textContent = "Done";
  } catch (e) {
    const IOException = await lib.java.io.IOException;
    if (e instanceof IOException) {
      statusEl.textContent = "I/O error while writing PDF";
    } else {
      statusEl.textContent = "Error: " + (await e.getMessage?.() ?? e);
    }
  }
});
```

Next, in `index.html`, we include CheerpJ and `script.js`, provide a “Generate PDF” button, and display the resulting PDF directly in the page using an `<iframe>`.

```html title="index.html"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CheerpJ Library Mode – PDF demo</title>

  <script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>

  <style>
    body { font: 14px, sans-serif; margin: 2rem; }
    iframe { width: 100%; height: 70vh; border: 1px solid #ccc; }
  </style>
</head>

<body>
  <button id="makePdf">Generate PDF</button>
  <p id="status"></p>
  <iframe id="pdfDisplay"></iframe>

  <script type="module" src="./script.js"></script>
</body>
</html>
```

## See also

Library mode is also used for [native methods implemented in JavaScript][JNI]. A `native` is effectively just a shorter library mode session.

[JNI]: /docs/guides/implementing-native-methods
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
