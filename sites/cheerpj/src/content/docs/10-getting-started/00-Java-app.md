---
title: Run a Java Application
description: Convert a desktop app to a webapp
---

CheerpJ runs a Java application in the browser from its existing JAR files, with little or no modification. This page takes you from a JAR file to the application running in a browser tab.

CheerpJ runs compiled bytecode, so you need neither the Java source code nor a local Java installation.

**To get started you will need:**

- Your application's JAR file(s). To try CheerpJ first, you can use Oracle's [TextDemo.jar](https://docs.oracle.com/javase/tutorialJWS/samples/uiswing/TextDemoProject/TextDemo.jar) sample.
- An HTML page to run the application from.
- An HTTP server that supports Range requests, to test the page locally.

## 1. Create a project directory

Create a folder for the project and copy your JAR files into it. The HTML file goes in the same folder.

```shell
mkdir my-project
```

## 2. Create a basic HTML file

Create an `index.html` file in the project directory, next to your JAR files. The page loads CheerpJ, initialises it, creates a display for the Java windows and runs the JAR:

```html title="index.html" {6, 9-13}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ Java App Example</title>
		<script src="https://cjrtnc.leaningtech.com/5.0/loader.js"></script>
	</head>
	<body>
		<script type="module">
			await cheerpjInit();
			cheerpjCreateDisplay(800, 600);
			await cheerpjRunJar("/app/my_application_archive.jar");
		</script>
	</body>
</html>
```

[`cheerpjRunJar`] runs the main class named in the JAR's manifest, as `java -jar` does. If your application is started with `java -cp ... com.application.MyClassName` instead, use [`cheerpjRunMain`] with the fully-qualified class name and the class path, separating JARs with `:`:

```js
await cheerpjRunMain(
	"com.application.MyClassName",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar"
);
```

Command line arguments go after the JAR name or class path, one string per argument.

CheerpJ runs Java 8 unless you choose another version. To run on Java 11, 17, 21 or 25, pass the [`version`] option to [`cheerpjInit`], for example `await cheerpjInit({ version: 17 });`.

> [!note] Don't forget to use the /app/ prefix
> Paths passed to [`cheerpjRunJar`] and [`cheerpjRunMain`] are in CheerpJ's [virtual filesystem], not URLs. `/app/` is the root of the web server the page is loaded from, so `/app/my_application_archive.jar` is the file `my_application_archive.jar` in the project directory. Leaving out the `/app/` prefix is the most common first mistake.

## 3. Host your page

Serve the project directory with an HTTP server, such as http-server:

```shell
cd my-project
npx http-server -p 8080
```

Then open `http://localhost:8080` in the browser.

> [!note] Info
> Opening the page directly from disk (a `file://` URL) does not work. The server must support HTTP Range requests: `npx http-server` and `npx serve` do, Python's `http.server` does not. See [basic server setup](/docs/guides/basic-server-setup), and use HTTPS in production.

## The result

The CheerpJ display appears in the page and shows loading messages, then your application's windows. The first start downloads the parts of the Java runtime the application needs, so it is slower than later starts, when the browser has them cached. Depending on the application and the optimisations applied, this takes a few seconds.

## What's going on?

- The `<head>` script loads CheerpJ.
- [`cheerpjInit`] initialises the CheerpJ runtime environment.
- [`cheerpjCreateDisplay`] creates the area of the page that holds all the Java windows.
- [`cheerpjRunJar`] runs your application.
- `/app/` is a [virtual filesystem] mount point for the **root of the web server** the page is loaded from.

### Is your application not working?

If your application doesn't work, check the following:

- The page URL starts with `http://` or `https://`, not `file://`, and the server supports Range requests.
- The JAR paths are correct and start with `/app/`. In the browser developer tools, the Network tab shows whether each JAR downloads; a 404 for a JAR means its path is wrong. CheerpJ also requests files that may not exist, so other 404 errors in the console are expected.
- The application works normally on your machine without CheerpJ.

## Further reading

- [Startup time optimisation](/docs/guides/Startup-time-optimization)
- [Runtime API reference](/docs/reference)

[`cheerpjInit`]: /docs/reference/cheerpjInit
[`version`]: /docs/reference/cheerpjInit#version
[`cheerpjCreateDisplay`]: /docs/reference/cheerpjCreateDisplay
[`cheerpjRunJar`]: /docs/reference/cheerpjRunJar
[`cheerpjRunMain`]: /docs/reference/cheerpjRunMain
[virtual filesystem]: /docs/guides/filesystem
