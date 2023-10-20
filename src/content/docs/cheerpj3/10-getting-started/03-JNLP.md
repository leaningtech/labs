---
title: Run a JNLP
description: Run a JNLP application in the browser (setup)
---

This quickstart tutorial will take you step by step on the things you need to setup before running your JNLP app in the browser with CheerpJ.

You will need:

- The application `.jnlp` file.

## 1. The `.jnlp` file

The `.jnlp` file contains the specifics of how to launch your Java application. The usual pipeline starts when this file is triggered from a website so it is passed to the user's local JNLP client which downloads the application `.jar` files and further resources. Finally, the app is executed with the local JRE installation. **With CheerpJ it is possible to run this application in the browser sandbox, no Java installation required.**

Your `.jnlp` file might look something like the example below. There are two essential elements you need to find:

1. The `.jar` files specified under the `<resources>` element, usually indicated with a `<jar>` or `<nativelib>` tags.
2. Your application type. Seek for ` <application-desc>` or `<applet-desc>` tag.
3. You may need the `codebase` URL at `<jnlp>`

```xml title="example.jnlp" {5, 22-23, 26}
<?xml version="1.0" encoding="utf-8"?>
<!-- JNLP Example -->
<jnlp
  spec="1.0+"
  codebase="code-base-url"
  href="example.jnlp">
  <information>
    <title>Your application name </title>
    <vendor>Vendor name</vendor>
    <homepage href="home-page-url"/>
    <description>Description of your Java application</description>
    <description kind="short">Another description of your Java application </description>
    <icon href="image-url"/>
    <icon kind="icon-name" href="image-url"/>
    <offline-allowed/>
  </information>
  <security>
      <all-permissions/>
  </security>
  <resources>
    <j2se version="1.4+" initial-heap-size="64m" max-heap-size="640m" />
    <jar href="my_application_archive.jar"/>
    <jar href="lib/my_dependency.jar"/>
    <property name="key" value="overwritten" />
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
        ├── my_dependency.jar
```

## 3. Identify your application type

A JNLP app can be a **standalone application** or an **applet**. This is easy to spot on your `.jnlp` file with the tags **`<application-desc>`** or **`<applet-desc>`** correspondingly. The following steps for each type of app are described below.

### If your application is a standalone app

Before jumping to the next steps, take a close look at content of `<application-desc>` and keep the following at hand:

- **The application class name:** You can find it at the `main-class` attribute. This attribute may not be there if the class name is included in the manifest.
- **The application arguments:** If any arguments are required, you will find these with the `<argument>` tag.

> [!note] Note
> If you do not find any of the elements listed above, this means you do not need them to run your application.

Now you have everything you need until this point to run your JNLP app as a standalone application. Please continue to our [run a Java application] tutorial to run it in the browser with CheerpJ.

### If your application is an applet

Take a close look to the `<applet-desc>` tag on your `.jnlp` and keep the following at hand:

- **Any applet tag parameters:**

  - **The applet class name:** You can find it at the main-class attribute.
  - **The applet ideal size:** defined at `width` and `height` attributes.
  - **Applet parameters:** found as `<param>` within `<applet-desc>` if your applet requires it.

- **documentBase:** If you retrieve this URL, you will obtain an HTML file where the applet is wrapped. You can use it or create your own HTML file like [this one](/cheerpj3/getting-started/Java-applet#1-integrating-cheerpj-in-your-html-file).

Now you have everything you need until this point to run your JNLP app as an applet. Please continue to our [run a Java applet] tutorial to run it in the browser with CheerpJ.

## The end

You are done setting up what you needed from your JNLP file. Now you can continue with the appropriate tutorial to run your app in the browser with CheerpJ.

<div class="not-prose grid grid-cols-2 font-medium gap-2 text-stone-100">
	<a
		href="/cheerpj3/getting-started/Java-app"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Application
	</a>
	<a
		href="/cheerpj3/getting-started/Java-applet"
		class="px-8 py-6 bg-stone-800 hover:bg-stone-700 text-lg"
	>
		Applet
	</a>
</div>

[run a Java application]: /cheerpj3/getting-started/Java-app
[run a Java applet]: /cheerpj3/getting-started/Java-applet
