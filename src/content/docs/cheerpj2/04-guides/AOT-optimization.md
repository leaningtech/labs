---
title: AOT Optimization
---

CheerpJ AOT compiler is very easy to use, this page will guide you step by step into compiling an unmodified `.jar` file to a `.jar.js` file. We will also create a basic HTML file integrated with the CheerpJ loader to run the Java application in the browser.

This optimization is not required for running a Java application or applet in the browser but it enhaces performance. Before doing any compilation it is recommended to firstly run your application without the AOT optimization to ensure everything works.

## 1. CheerpJ AOT compiler installation

Visit [our download page](https://leaningtech.com/download-cheerpj/) and download the CheerpJ archive for your platform. CheerpJ is available for Linux, Mac OS X and Windows.

CheerpJ is distributed as an archive for all the platforms, you can unpack the archive anywhere in the system. During the tutorial we will assume that CheerpJ has been unpacked in the Applications directory `/Applications/cheerpj_2.3/`. Please keep in mind to use a different path in the following commands if you have chosen a different position or you are using a different version of CheerpJ.

## 2. Compiling from `.jar` to `.jar.js`

`cheerpjfy.py` is an helper script that automatically takes care of unpacking, compiling and optimising a whole `.jar` archive, you can find it under your CheerpJ installation directory. Using `cheerpjfy.py` is the recommended way of compiling applications and libraries using CheerpJ.

### Compiling a `.jar` file

```shell
/Applications/cheerpj_2.3/cheerpjfy.py my_application_archive.jar
```

This command will generate a file called `my_application_archive.jar.js`, which needs to be deployed in the same folder of the original `.jar` archive, and hosted on a web server. Instructions on how to serve the converted JavaScript on a web page are provided below.

> **Important:** The files _must_ be accessed through a Web server. Trying to open the HTML page directly from the disk is not supported. The URL must look like `http://127.0.0.1:8080/cheerpj_test.html`, if it looks like `file://c/users/Test/cheerpj_test.html` CheerpJ won't be able to start.

**Note to Windows users:** You will need to have python3 installed on the system. Python provides a launcher called `py` that will automatically detect and use the right version of python for a given script. To use `cheerpjfy.py` on Windows you need to prefix all the commands with `py`, for example:

```shell
py c:\cheerpj_2.3\cheerpjfy.py application.jar
```

### Compiling multiple `.jar` files

If your `.jar` has any dependencies in the form of further `.jar` archives, the `cheerpjfy.py` command line must be modified as follows:

```shell
/Applications/cheerpj_2.3/cheerpjfy.py --deps my_dependency_archive.jar my_application_archive.jar
```

This command will generate `my_application_archive.jar.js` but **not** `my_dependency_archive.jar.js`. Each archive should be compiled separately by invoking `~/cheerpj_2.3/cheerpjfy.py my_dependency_archive.jar`.

It is in general safe to put the target `.jar` in the `--deps` list, although it is not required. If you have an application composed of many `.jar` you can do something like this:

```
for f in one.jar two.jar three.jar
do
    ~/cheerpj_2.3/cheerpjfy.py --deps one.jar:two.jar:three.jar $f
done
```

## 3. Create an HTML page

Once we had compiled our java files, we create an HTML page just as we do in our [getting started](/cheerpj2/getting-started) tutorials. The example below is for a [Java application](/cheerpj2/getting-started/Java-app). Java applets can also be compiled in the same manner explained above.

```html title="index.html"
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
		cheerpjRunJar("/app/application.jar");
	</script>
</html>
```

> **Important:** Please notice that `.jar.js` file(s) are not passed as an argument of `cheerpjRunJar()`, only the location of the `.jar` files is indicated but both `.jar` and `.jar.js` files should be together under the same directory.

## 4. Host your page locally

To test CheerpJ you _must_ use a local Web Server. Opening the ``.html` page directly from the disk (for example, by double-clicking on it) is **_not supported_**. This is a very common mistake for first time users.

> **_TIP_**: There are many different Web servers that you can use, and all of them should work.

**For a quick test we recommend:**

```shell title="python 2"
python2 -m SimpleHTTPServer 8080
```

 <br />

```shell title="python 3"
python3 -m http.server 8080
```

 <br />

```shell title="npm http-server"
http-server -p 8080
```

## Further reading

- [Startup time optimization](cheerpj2/guides/Startup-time-optimization)
- [Command line options](/cheerpj2/reference/Command-Line-Options)

---

## Using CheerpJ's AOT compiler

### Build or download the JAR file

CheerpJ compiles unmodified JAR files to JavaScript so that they can run in the browser. Java source code is not needed to use CheerpJ. If you are building your own application you should already have its JAR file. For this example we will download a basic Swing example. Download the [TextDemo.jar](https://docs.oracle.com/javase/tutorialJWS/samples/uiswing/TextDemoProject/TextDemo.jar) file into a new directory. Below we will assume that this new directory is `~/cheerpj_tutorial/`

### Build the JAR.JS file

CheerpJ provides a convenient python program to convert whole JARs to JavaScript: `cheerpjfy.py`. It supports several options for advanced users, but it's basic syntax is very simple. The following command will generate `TextDemo.jar.js`

```shell
cd ~/cheerpj_tutorial/
/Applications/cheerpj_2.3/cheerpjfy.py TextDemo.jar
```

**NOTE**: `cheerpjfy.py` it's a python3 program, you need to have python3 installed on your system.
**NOTE**: On windows you should prefix the command with the `py` launcher to use the correct version of python.

Let's break down what is going on:

- We first include the CheerpJ [loader](https://cjrtnc.leaningtech.com/2.3/loader.js) from our cloud runtime as `<script src="https://cjrtnc.leaningtech.com/2.3/loader.js"></script>`. This file is the only script that needs to be loaded to use CheerpJ. CheerpJ will _automatically_ load all other files, including the `TextDemo.jar.js` we generated above.

- We initialize CheerpJ using `cheerpjInit()`. See [Runtime API](/cheerpj2/reference/Runtime-API#cheerpjinit) for more information.
- We want to run a graphical application (i.e. a Swing or AWT application), so we need to initialize a _virtual display_ in the page. CheerpJ will render all Java windows into this display.
- We can now start the JAR file. CheerpJ will _automatically_ download the `TextDemo.jar.js` file as soon as the first application class is loaded

**_NOTE_**: The `/app/` prefix use in cheerpjRunJar is something that many first time users find confusing. CheerpJ implements a UNIX style virtual filesystem internally, with several _mount points_. For example

- `/lt/` -> CheerpJ cloud runtime
- `/files/` -> An IndexedDB based, persistent, file storage
- `/app/` -> An HTTP based filesystem, used to access JARs and data from your local server.

The `/app/` directory is virtual, it only exists inside of CheerpJ and it's needed to distinguish files from the local server from runtime files and files stored in the browser database. The `/app/` directory actually refers to the _root_ of your web server. So, assuming that your web server is available at `http://127.0.0.1:8080/`, here are some example file mappings:

- `/app/TextDemo.jar` -> `http://127.0.0.1:8080/TextDemo.jar`
- `/app/subdirectory/data.txt` -> `http://127.0.0.1:8080/subdirectory/data.txt`

### Run the application in the browser

To test CheerpJ you _must_ use a local Web Server. Opening the `cheerpj_tutorial.html` page directly from the disk (for example, by double-clicking on it) is **_not supported_**. This is a very common mistake for first time users.

**_TIP_**: There are many different Web servers that you can use, and all of them should work. For a quick test we recommend:

- Python2: `python2 -m SimpleHTTPServer 8080`
- Python3: `python3 -m http.server 8080`
- npm (http-server): `http-server -p 8080`

To run TextDemo.jar in the browser using CheerpJ, do the following

```console
cd ~/cheerpj_tutorial/
python3 -m http.server 8080
```

Now open your favourite browser and enter the following URL `http://127.0.0.1:8080/cheerpj_tutorial.html`. You will see the CheerpJ spinner during a brief loading phase. Then the Java window will appear and it will look identical to the native version.

## The end!

Congratulations, you have successfully compiled and run your first Java application using CheerpJ. For more information, please read our in-depth [Getting Started](/cheerpj2/getting-started/Getting-Started) page.
