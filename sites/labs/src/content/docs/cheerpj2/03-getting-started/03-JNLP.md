---
title: Run a JNLP
description: Run a JWS/JNLP application in the browser
---

This quickstart tutorial will take you step by step on how to run your JNLP app (also known as Java Web Start application) in the browser with CheerpJ.

You will need:

- The application `.jnlp` file.
- An HTML file where your Java app will be wrapped.
- A simple HTTP server to test your webpage locally.

## 1. The `.jnlp` file

The `.jnlp` file contains the specifics of how to launch your Java application. The usual pipeline starts when this file is triggered from a website so it is passed to the user's local JNLP client which downloads the application `.jar` files and further resources. Finally, the app is executed with the local JRE installation. **With CheerpJ it is possible to run this application in the browser sandbox, no Java installation required.**

Your `.jnlp` file might look something like the example below. There are three essential elements you need to find:

1. The `.jar` files specified under the `<resources>` element, usually indicated with a `<jar>` or `<nativelib>` tags.
2. Your application type. Look for an `<application-desc>` or `<applet-desc>` tag.
3. You may need the `codebase` URL given by `<jnlp>`.

```xml title="example.jnlp" {5, 22-23, 26}
<?xml version="1.0" encoding="utf-8"?>
<!-- JNLP Example -->
<jnlp
  spec="1.0+"
  codebase="code-base-url"
  href="example.jnlp">
  <information>
    <title>Your application name</title>
    <vendor>Vendor name</vendor>
    <homepage href="home-page-url"/>
    <description>Description of your Java application</description>
    <description kind="short">Another description of your Java application</description>
    <icon href="image-url"/>
    <icon kind="icon-name" href="image-url"/>
    <offline-allowed/>
  </information>
  <security>
      <all-permissions/>
  </security>
  <resources>
    <j2se version="1.4+" initial-heap-size="64m" max-heap-size="640m"/>
    <jar href="my_application_archive.jar"/>
    <jar href="lib/my_dependency.jar"/>
    <property name="key" value="overwritten"/>
  </resources>
  <application-desc main-class="com.application.MyClassName"/>
</jnlp>
```

## 2. Create a project directory

Once you have identified where the `<jar>` or `<nativelib>` tags are in your JNLP, you can simply download these JARs by copying and pasting their URLs in the browser's navigation bar. If these URLs are relative then build the full URL by appending the `codebase` URL and the `jar` URL:

For example:

```
code-base-url/my_application_archive.jar
code-base-url/lib/my_dependency.jar
```

Please create a directory for your project and place the JARs you just downloaded inside this folder, remember to keep the same directory structure as shown in your `.jnlp`.

For example:

```shell
mkdir -p directory_name/lib
```

Once you moved the JARs it should look like this:

```
└── directory_name
    ├── my_application_archive.jar
    └── lib
        └── my_dependency.jar
```

## 3. Create a basic HTML file

### 3.1 Identify your application type

A JNLP app can be a **standalone application** or an **applet**. This is easy to spot on your `.jnlp` file with the tags **`<application-desc>`** or **`<applet-desc>`** correspondingly.

We will create a basic HTML file where the CheerpJ runtime will be integrated and the java application displayed. Create this file in the root of the project folder. The way the app is loaded might differ if the application is a standalone app or an applet. The following steps will specify how the HTML will look like for each case.

### 3.2 If your application is a standalone app

Take a close look at content of `<application-desc>` and keep the following at hand:

- **The application class name:** You can find it at the `main-class` attribute. This attribute may not be there if the class name is included in the manifest.
- **The application arguments:** If any arguments are required, you will find these with the `<argument>` tag.

> [!note] Note
> If you do not find any of the elements listed above, this means you do not need them to run your application.

Example of an HTML file for an app where the class name is included in the manifest:

```html title = "index.html" {6, 9-13}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ test</title>
		<script src="https://cjrtnc.leaningtech.com/2.3/loader.js"></script>
	</head>
	<body>
		<script>
			cheerpjInit();
			cheerpjCreateDisplay(800, 600);
			cheerpjRunJar("/app/my_application_archive.jar");
		</script>
	</body>
</html>
```

Alternatively, if the class name is in the `.jnlp` file but not in the manifest, then replace [`cheerpjRunJar()`] for [`cheerpjRunMain()`]:

```js
cheerpjRunMain(
	"com.application.MyClassName",
	"/app/my_application_archive.jar:/app/lib/my_dependency_archive.jar"
);
```

Any application arguments must be passed to [`cheerpjRunJar()`] or [`cheerpjRunMain()`].
The `/app/`prefix is a virtual filesystem mount point that references the root of the web server this page is loaded from.

### 3.2 If your application is an applet

Take a close look to the `<applet-desc>` tag on your `.jnlp` and keep the following at hand:

- **Any applet tag parameters:**

  - **The applet class name:** You can find it at the main-class attribute.
  - **The applet ideal size:** defined at `width` and `height` attributes.
  - **Applet parameters:** found as `<param>` within `<applet-desc>` if your applet requires it.

- **documentBase:** If you retrieve this URL, you will obtain an HTML file where the applet is wrapped. You can use it, or create your own HTML like the example below. If you use the `documentBase` HTML file, remember to add the scripts where the CheerpJ runtime is integrated and called.

The HTML for an applet would look like this:

```html title="index.html" {6, 9-17}
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpJ applet test</title>
		<script src="https://cjrtnc.leaningtech.com/2.3/loader.js"></script>
	</head>
	<body>
		<applet
			archive="my_applet_archive.jar"
			code="com.applet.MyClassName"
			height="900"
			width="900"
		></applet>
		<script>
			cheerpjInit({ enablePreciseAppletArchives: true });
		</script>
	</body>
</html>
```

Any applet parameters should be passed as `<param>` in the `<applet>` tag as usual:

```html {7}
<applet
	archive="my_applet_archive.jar"
	code="com.applet.MyClassName"
	height="900"
	width="900"
>
	<param name="paramName" value="paramValue" />
</applet>
```

> In case your users have a native Java plugin installed, you can replace the original HTML tag with a cheerpj- prefixed version. `<cheerpj-applet>`, `<cheerpj-object>`, and `<cheerpj-embed>` are all supported.

## 4. Host your page

Your final project directory tree should look similar to:

```
└── directory_name
    ├── index.html
    ├── my_application_archive.jar
    └── lib
        └── my_dependency.jar
```

You can now go to the project directory and serve this web page on a simple HTTP server, such as the http-server utility.

```sh
cd directory_name
npm install http-server
http-server -p 8080
```

## The end

This is the end of the tutorial. To learn more about running standalone applications and applets with CheerpJ, you can visit the dedicated tutorials:

<div class="not-prose grid grid-cols-2 font-medium gap-2 text-stone-100">
	<a
		href="/cheerpj2/getting-started/Java-app"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Application
	</a>
	<a
		href="/cheerpj2/getting-started/Java-applet"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Applet
	</a>
</div>

[run a Java application]: /cheerpj2/getting-started/Java-app
[run a Java applet]: /cheerpj2/getting-started/Java-applet
[`cheerpjRunJar()`]: /cheerpj2/reference/Runtime-API#cheerpjrunjar
[`cheerpjRunMain()`]: /cheerpj2/reference/Runtime-API#cheerpjrunmain
