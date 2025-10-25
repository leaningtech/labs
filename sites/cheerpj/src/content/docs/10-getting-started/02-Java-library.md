---
title: Run a Java library
description: Use Java classes in JavaScript
---

CheerpJ can load and run Java libraries directly in the browser, allowing you to call Java classes and methods from JavaScript with no modifications to your original code. This page will help you get started with CheerpJ and show you how to use an existing Java library (`.jar` file) within a web application.

Java source code is not required to use CheerpJ. If you are using your own library, you should already have its compiled `.jar` file available.

**To get started you will need:**

- Your `.jar` file.
- An HTML file where your Java app will be wrapped.
- A simple HTTP server to test your webpage locally.

## 1. Create a Project Directory

Let's start by creating a project folder where all your files will be. Copy your java and future HTML files here.

```shell
mkdir directory_name
```

## 2. Create a Basic HTML File

Let's create a basic HTML file and include and initialize CheerpJ on your page. The `cheerpjInit` command initialises the CheerpJ runtime environment.

```html title="index.html" {6, 10}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ Library Mode Test</title>
		<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
	</head>
	<body>
		<script>
			await cheerpjInit();
		</script>
	</body>
</html>
```

## 3. Load and Call the Java Library From Java

Now we can load your Java library by calling `cheerpjRunLibrary` which will load the library from the root of your web server. We are assuming your HTML file and your `.jar` files are under the project directory you just created.

```html title="index.html" {12-15}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ Library Mode Test</title>
		<script src="https://cjrtnc.leaningtech.com/4.2/loader.js"></script>
	</head>
	<body>
		<script>
			await cheerpjInit();
      // Example classes and methods — replace these with those from your own library
			const cj = await cheerpjRunLibrary("/app/library.jar");
			const MyClass = await cj.com.library.MyClass;
			const obj = await new MyClass();
			await obj.myMethod();
		</script>
	</body>
</html>
```

## 3. Host your page

You can now serve this web page on a simple HTTP server, such as the http-server utility.

```shell
npx http-server -p 8080
```

## The Result

You will see CheerpJ initialize in your browser and load the Java library. Once loaded, the methods from your library can be called directly from JavaScript, just as in the example above. Depending on the size of your library and the optimizations applied, this may take just a few seconds before your code begins executing.

## Further reading

- [Learn more about Library Mode](/docs/guides/library-mode)
- [`cheerpjRunLibrary` reference](/docs/reference/cheerpjRunLibrary)
