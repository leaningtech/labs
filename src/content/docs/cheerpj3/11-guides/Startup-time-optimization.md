---
title: Resource preloading
description: Improves application startup time
---

Traditionally, users had to have Java preinstalled on their computer in order to run Java applications and applets. CheerpJ compiles Java to HTML5/JavaScript, allowing to run applications and applets on browser without users having to install any additional dependency on their computer. Similarly to their JVM counterparts, applications compiled to JavaScript with CheerpJ require runtime components to be loaded during execution. In CheerpJ, runtime components are JavaScript modules that are loaded on demand, only if required.

The CheerpJ runtime is highly optimised to minimise the total download size of an 'average' application, totalling 10-20MB of data for a typical download (as a point of comparison, the approximate size of the Java runtime installer is over 60MB). All downloaded components of CheerpJ are cached by the browser, which reduces the download time in subsequent executions of a same application.

CheerpJ cannot predict which runtime resources will be required by an arbitrary application. CheerpJ runtime resources are therefore loaded on demand, one after the other, depending on the requirements of the application at run time.

To take advantage of parallel downloads, and reduce download and startup time of a specific application in production, CheerpJ allows to pre-specify a list of resources (CheerpJ runtime modules) to be loaded at startup.

This list of resources is to be specified manually when starting the CheerpJ environment in an HTML page. We also provide a simple profiling tool to automatically record and output a list of used resources during the execution of an application.

By combining the use of this profiler together with the preloader, one can highly optimise the initial download and startup time of an application. Taking advantage of this is a simple 2-step process:

1. Run the application normally using CheerpJ. After the application is loaded, open the JavaScript console of the browser (e.g. Ctrl+Shift+I on many browsers), and type:

```js
cjGetRuntimeResources();
```

The result will look like this:

```js
{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}
```

If the output is not visible fully, you can use:

```js
document.write(cjGetRuntimeResources());
```

The JavaScript console may enclose the string between quotes (`"`), which you should ignore. See [here](/cheerpj3/reference/cjGetRuntimeResources) for more information.

2. Modify the CheerpJ integration to enable preloading. You will only need to change the `cheerpjInit` call, to pass the `preloadResources` option. For example:

```js
cheerpjInit({ preloadResources: {"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]} });
```

> [!note] Important
> Please note that this has to be done in two steps, so the resources are loaded in a separate session from the full workflow.

See [here](/cheerpj3/reference/cheerpjInit#preloadresources) for more information.

When preloading is enabled CheerpJ will be able to download multiple resources in parallel with the execution of the program. This will greatly improve loading time.
