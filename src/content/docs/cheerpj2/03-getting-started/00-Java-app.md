---
title: Run a Java Application
---

CheerpJ can run a Java application in the browser with little to no modifications. This page will help you getting started with CheerpJ and running your first Java application in the browser.

**To get started you will need:**

- Your java application file(s)
- An HTML file where your Java app will be wrapped
- A simple HTTP server to test your webpage locally

## 1. Create a basic HTML file

Let's start by creating a simplet HTML file like the following example. Please notice the CheerpJ runtime environment has been integrated. In this example we are assuming your HTML file and your .jar files are under the same directory.

```html title="index.html" {6, 9-16}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ test</title>
		<script src="https://cjrtnc.leaningtech.com/2.3/loader.js"></script>
	</head>
	<body></body>
	<script>
		cheerpjInit();
		cheerpjCreateDisplay(800, 600);
		cheerpjRunMain(
			"ChangeThisToYourClassName",
			"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
		);
	</script>
</html>
```

## 2. Host your page

You can now serve this web page on a simple HTTP server, such as the http-server utility.

```shell
npm install http-server
http-server [path] [options]
```

## What's going on?

- CheerpJ loader is included from our cloud runtime as
  `<script src="https://cjrtnc.leaningtech.com/2.3/loader.js"></script>`.
- CheerpJ runtime environment is initilized by `cheerpjInit()`.
- `cheerpjCreateDisplay()` creates a graphical environment to contain all Java windows
- `cheerpjRunMain()` executes the `main` method of `ChangeThisToYourClassName`. The second parameter is a `:` separated list of `.jar` files where application classes can be found (the classpath).
- The `/app/` is a virtual file system mount point that reference the root of the web server this page is loaded from.

## Further reading

- [AOT optimization](/cheerpj2/guides/AOT-optimization)
- [Runtime API](http://localhost:3000/cheerpj2/reference/Runtime-API)
