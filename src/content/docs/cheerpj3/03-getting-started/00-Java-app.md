---
title: Run a Java application
---

CheerpJ can run a Java application in the browser with little to no modifications. This page will help you getting started with CheerpJ and running your first Java application in the browser.

Java source code is not needed to use CheerpJ. If you are building your own application you should already have its `.jar` file(s).

**To get started you will need:**

- Your Java application file(s). You can also use this [TextDemo.jar](https://docs.oracle.com/javase/tutorialJWS/samples/uiswing/TextDemoProject/TextDemo.jar) sample.
- An HTML file where your Java app will be wrapped
- A simple HTTP server to test your webpage locally

## 1. Create a project directory

Let's start by creating a project folder where all your files will be. Please copy your java and future HTML files here.

```shell

mkdir directory_name

```

## 2. Create a basic HTML file

Let's create a basic HTML file like the following example. Please notice the CheerpJ runtime environment has been integrated and initialized. In this example we are assuming your HTML file and your `.jar` files are under the project directory you just created.

```html title="index.html" {6, 9-13}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ test</title>
		<script src="https://cjrtnc.leaningtech.com/3_20230819_174/cj3loader.js"></script>
	</head>
	<body>
		<script type="module">
			await cheerpjInit();
			await cheerpjCreateDisplay(800, 600);
			await cheerpjRunJar("/app/my_application_archive.jar");
		</script>
	</body>
</html>
```

Alternatively, if your application is not designed to be executed with the command `java -jar` you can replace `cheerpjRunJar()` for `cheerpjRunMain()` and pass your qualified class name as an argument. For example:

```js
cheerpjRunMain(
	"com.application.MyClassName",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
);
```

## 3. Host your page

You can now serve this web page on a simple HTTP server, such as the http-server utility.

```shell
npm install http-server
http-server -p 8080
```

> To test CheerpJ you must use a web server. Opening the `.html` page directly from the disk (for example, by double-clicking on it) is not supported.

## What's going on?

- CheerpJ loader is included from our cloud runtime as
  `<script src="https://cjrtnc.leaningtech.com/2.3/loader.js"></script>`.
- CheerpJ runtime environment is initialized by `cheerpjInit()`.
- `cheerpjCreateDisplay()` creates a graphical environment to contain all Java windows
- `cheerpjRunMain()` executes the `main` method of `ChangeThisToYourClassName`. The second parameter is a `:` separated list of `.jar` files where application classes can be found (the classpath).
- The `/app/` is a virtual file system mount point that reference the root of the web server this page is loaded from.

## The result

You will see the CheerpJ display on your browser with some loading messages before showing your application running. Depending on your application and the optimizations applied, this could take just a few seconds.

## Further reading

- [Runtime API](/cheerpj3/reference/Runtime-API)
