---
title: Library mode
description: Use Java libraries in JavaScript
---

Library mode lets JavaScript use Java classes, objects and arrays directly. JavaScript loads classes, creates objects, calls methods and reads fields with `async` and `await`, so Java libraries can be used alongside the rest of a web application's code.

## Getting started

To load a library, call [`cheerpjRunLibrary`] after [`cheerpjInit`]:

- `await cheerpjRunLibrary("")` loads **only the Java standard library**
- `await cheerpjRunLibrary("/app/path/to/some.jar")` loads the Java standard library **plus** all the classes in the JAR

This first example uses the Java standard library. A JavaScript file initialises CheerpJ and uses **library mode** to call a few standard library classes.

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

// Convert the list to an Object[] array
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

A minimal HTML page includes the script. The output is printed to the browser console.

> Note that the HTML page needs to include the public `loader.js` script.

```html title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>CheerpJ Library mode (Standard library)</title>

		<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>
	</head>

	<body>
		<h1>Library mode – Standard library</h1>
		<p>Open the browser console to view the output.</p>

		<script type="module" src="./script.js"></script>
	</body>
</html>
```

## Example: generating a PDF with iText

Library mode brings existing Java libraries into a web application. In this example, a few lines of JavaScript generate a PDF with the iText library.

**This example:**

- Loads `itextpdf-5.5.13.3.jar`
- Builds a PDF and writes it to `/files/HelloIText.pdf`
- Reads it back as a `Blob` with [`cjFileBlob`] and shows it in the page

`script.js` initialises CheerpJ and loads the iText JAR in library mode once, when the page loads. Each click of the button uses iText to write a "Hello World!" PDF to `/files/HelloIText.pdf`, reads the file back as a `Blob` and shows it through an object URL.

```js title="script.js"
const statusEl = document.getElementById("status");
const pdfDisplay = document.getElementById("pdfDisplay");

// cheerpjInit must be called only once in the page
statusEl.textContent = "Initialising CheerpJ…";
await cheerpjInit();

statusEl.textContent = "Loading iText library…";
const lib = await cheerpjRunLibrary("/app/itextpdf-5.5.13.3.jar");
statusEl.textContent = "Ready";

document.getElementById("makePdf").addEventListener("click", async () => {
	try {
		const Document = await lib.com.itextpdf.text.Document;
		const Paragraph = await lib.com.itextpdf.text.Paragraph;
		const PdfWriter = await lib.com.itextpdf.text.pdf.PdfWriter;
		const FileOutputStream = await lib.java.io.FileOutputStream;

		const document = await new Document();
		await PdfWriter.getInstance(
			document,
			await new FileOutputStream("/files/HelloIText.pdf")
		);

		await document.open();
		await document.add(await new Paragraph("Hello World!"));
		// Closing the document also closes the writer and the output stream
		await document.close();

		const blob = await cjFileBlob("/files/HelloIText.pdf");
		const url = URL.createObjectURL(blob);
		pdfDisplay.src = url;
		statusEl.textContent = "Done";
	} catch (e) {
		const IOException = await lib.java.io.IOException;
		if (e instanceof IOException) {
			statusEl.textContent = "I/O error while writing PDF";
		} else {
			statusEl.textContent = "Error: " + ((await e.getMessage?.()) ?? e);
		}
	}
});
```

`index.html` includes CheerpJ and `script.js`, provides a "Generate PDF" button, and shows the PDF in the page in an `<iframe>`.

> Note that the HTML page needs to include the public `loader.js` script.

```html title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>CheerpJ Library Mode – PDF demo</title>

		<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>

		<style>
			body {
				font: 14px sans-serif;
				margin: 2rem;
			}
			iframe {
				width: 100%;
				height: 70vh;
				border: 1px solid #ccc;
			}
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

Library mode is also used by [native methods implemented in JavaScript][JNI]: the `lib` parameter a native method receives is a library mode session. For the methods of a library mode session and how values are converted, see [`CJ3Library`].

[JNI]: /docs/guides/implementing-native-methods
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cjFileBlob`]: /docs/reference/cjFileBlob
[`CJ3Library`]: /docs/reference/CJ3Library
