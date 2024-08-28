---
title: ライブラリモード
description: JavaScriptでJavaライブラリを使用する
---

ライブラリモードを使用すると、JavaScriptからJavaのメソッド、オブジェクト、配列を直接利用できます。 このAPIは、async/awaitを活用して、自然に使えるように設計されており、柔軟性を損なうことはありません。

ライブラリの読み込みは、[`cheerpjRunLibrary`]を呼び出すだけで簡単に行えます。

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

ライブラリモードを使用すると、強力なJavaライブラリをWebアプリケーションに統合できます。実例として、この数行のコードで人気のあるiTextライブラリを使ってJavaScriptからPDFを生成することができます：

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
			await new FileOutputStream("/files/HelloIText.pdf"),
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

## 参照

ライブラリモードは、JavaScriptで実装された[`native`メソッド][JNI]にも使用されます。`native`メソッドは、実質的に短いライブラリモードセッションです。

[JNI]: /docs/ja/guides/Implementing-Java-native-methods-in-JavaScript
[`cheerpjRunLibrary`]: /docs/ja/reference/cheerpjRunLibrary
