---
title: Run a Java Library
description: Use Java classes in JavaScript
---

CheerpJ loads an existing Java library in the browser, so you can call its classes and methods from JavaScript without changing the original code. This page shows how to load a library's JAR file in a web page and call it.

You need the library's compiled JAR file, not its source code.

**To get started you will need:**

- Your library's JAR file.
- An HTML page to load it from.
- An HTTP server that supports Range requests, to test the page locally.

## 1. Create a project directory

Create a folder for the project and copy your JAR file into it. The HTML file goes in the same folder.

```shell
mkdir my-project
```

## 2. Create a basic HTML file

Create an `index.html` file in the project directory. Add CheerpJ's loader script to the `<head>`, then call [`cheerpjInit`] to initialise the CheerpJ runtime environment:

```html title="index.html" {6, 9-11}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ Library Mode Test</title>
		<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>
	</head>
	<body>
		<script type="module">
			await cheerpjInit();
		</script>
	</body>
</html>
```

The script is a module (`type="module"`) so that it can use `await` at the top level. In a classic `<script>`, wrap the code in an `async` function instead.

## 3. Load and call the Java library from JavaScript

Call [`cheerpjRunLibrary`] with the path to your JAR. `/app/` is the root of the web server, so `/app/library.jar` is the file `library.jar` in the project directory. You then use the library's classes and methods as JavaScript objects:

```html title="index.html" {11-15}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ Library Mode Example</title>
		<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>
	</head>
	<body>
		<script type="module">
			await cheerpjInit();
			// Example classes and methods: replace them with those from your own library
			const cj = await cheerpjRunLibrary("/app/library.jar");
			const MyClass = await cj.com.library.MyClass;
			const obj = await new MyClass();
			await obj.myMethod();
		</script>
	</body>
</html>
```

Loading a class, constructing an object (`await new`) and calling a method are asynchronous, so `await` each one. A method call resolves to the method's return value, converted as described in [`CJ3Library`]. Public fields are read and written directly, without `await`.

To use only the Java standard library, pass an empty string: `await cheerpjRunLibrary("")`.

## 4. Host your page

Serve the project directory with an HTTP server, such as http-server:

```shell
cd my-project
npx http-server -p 8080
```

Then open `http://localhost:8080` in the browser.

> [!note] Info
> Opening the page directly from disk (a `file://` URL) does not work. The server must support HTTP Range requests: `npx http-server` and `npx serve` do, Python's `http.server` does not. See [basic server setup](/docs/guides/basic-server-setup), and use HTTPS in production.

## The result

CheerpJ starts in the browser and loads your library. Once it has loaded, your JavaScript calls the library's methods. Output the library writes to `System.out` appears in the browser console. Depending on the size of the library and the optimisations applied, this can take a few seconds before your code starts running.

If nothing happens, open the browser console. A JavaScript error or a 404 for the JAR in the Network tab usually means the path to the JAR is wrong or is missing the `/app/` prefix.

## Further reading

- [Learn more about library mode](/docs/guides/library-mode)
- [Interoperability tutorial](/docs/tutorials/interoperability-tutorial)
- [`cheerpjRunLibrary` reference](/docs/reference/cheerpjRunLibrary)

[`cheerpjInit`]: /docs/reference/cheerpjInit
[`cheerpjRunLibrary`]: /docs/reference/cheerpjRunLibrary
[`CJ3Library`]: /docs/reference/CJ3Library
