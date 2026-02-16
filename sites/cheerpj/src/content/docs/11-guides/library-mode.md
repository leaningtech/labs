---
title: Library mode
description: Use Java libraries in JavaScript
---

Library mode allows you to directly use Java methods, objects, and arrays from JavaScript. This API has been designed to take advantage of async/await to feel more natural to use, without sacrificing any flexibility.

# Getting started

Loading a library is as simple as calling [`cheerpjRunLibrary`].

- `await cheerpjRunLibrary("")` loads **only the Java standard library**
- `await cheerpjRunLibrary("/path/to/some.jar")` loads the Java standard library **plus** that JAR

An example of using the standard Java library.

```js
async function libraryModeTour() {
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
}
```

# Example: generating a PDF with iText

Library mode can be used to integrate powerful Java libraries into your Web application. As a practical example, these few lines of code make it possible to generate a PDF from JavaScript using the popular iText library.

**This example:**

- Loads `itextpdf-5.5.13.3.jar`
- Builds a PDF and writes it to `/files/HelloIText.pdf`
- Reads it back as a blob and shows it in the page

```js
async function iTextExample() {
	await cheerpjInit();

	const lib = await cheerpjRunLibrary("/app/itextpdf-5.5.13.3.jar");

	try {
		const Document = await lib.com.itextpdf.text.Document;
		const Paragraph = await lib.com.itextpdf.text.Paragraph;
		const PdfWriter = await lib.com.itextpdf.text.pdf.PdfWriter;
		const FileOutputStream = await lib.java.io.FileOutputStream;

		const document = await new Document();
		const writer = await PdfWriter.getInstance(
			document,
			await new FileOutputStream("/files/HelloIText.pdf")
		);

		await document.open();
		await document.add(await new Paragraph("Hello World!"));
		await document.close();
		await writer.close();

		const blob = await cjFileBlob("/files/HelloIText.pdf");
		const url = URL.createObjectURL(blob);
		pdfDisplay.data = url;
	} catch (e) {
		const IOException = await lib.java.io.IOException;

		if (e instanceof IOException) console.log("I/O error");
		else console.log("Unknown error: " + (await e.getMessage()));
	}
}
```

# See also

Library mode is also used for [native methods implemented in JavaScript][JNI]. A `native` is effectively just a shorter library mode session.

[JNI]: /docs/guides/implementing-native-methods
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
