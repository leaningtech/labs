---
title: AOT Optimization
---

CheerpJ compiles unmodified `.jar` files to JavaScript as an optimization step. CheerpJ AOT compiler is very easy to use, this page will guide you step by step into compiling an unmodified `.jar` file to a `.jar.js` file. We will also create a basic HTML file integrated with the CheerpJ loader to run the Java application in the browser.

This optimization is not required for running a Java application or applet in the browser but it enhances performance. Before doing any compilation it is recommended to first run your application without the AOT optimization to ensure everything works.

## CheerpJ AOT compiler installation

Visit [our download page](https://leaningtech.com/download-cheerpj/) and download the CheerpJ archive for your platform. CheerpJ is available for Linux, Mac OS X and Windows.

CheerpJ is distributed as an archive for all the platforms, you can unpack the archive anywhere in the system. During the tutorial we will assume that CheerpJ has been unpacked in the Applications directory `/Applications/cheerpj_2.3/`. Please keep in mind to use a different path in the following commands if you have chosen a different position or you are using a different version of CheerpJ.

## Compiling from `.jar` to `.jar.js`

`cheerpjfy.py` is an helper script that automatically takes care of unpacking, compiling and optimising a whole `.jar` archive, you can find it under your CheerpJ installation directory. Using `cheerpjfy.py` is the recommended way of compiling applications and libraries using CheerpJ.

### Compiling a `.jar` file

```shell
/Applications/cheerpj_2.3/cheerpjfy.py my_application_archive.jar
```

This command will generate a file called `my_application_archive.jar.js`, which needs to be deployed in the same folder of the original `.jar` archive, and hosted on a web server. Instructions on how to serve our application on a web page are provided in our tutorials for running a [Java application](/cheerpj2/getting-started/Java-app) and a [Java applet](/cheerpj2/getting-started/Java-applet)

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

> **Important:** Please have in mind that `.jar.js` file(s) are not passed as an argument of `cheerpjRunJar()` or `cheerpjRunMain()`; only the location of the original `.jar` files are passed but both `.jar` and `.jar.js` files should exist together under the same directory.

## Further reading

- [Command line options](/cheerpj2/reference/Command-Line-Options)
- [Startup time optimization](cheerpj2/guides/Startup-time-optimization)
