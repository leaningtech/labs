---
title: Startup time optimization
---

This page is a collection of different steps to reduce the startup time of a Java application compiled with CheerpJ.

## Overview

Traditionally, users had to have Java preinstalled on their computer in order to run Java applications and applets. CheerpJ compiles Java to HTML5/JavaScript, allowing to run applications and applets on browser without users having to install any additional dependency on their computer. Similarly to their JVM counterparts, applications compiled to JavaScript with CheerpJ require runtime components to be loaded during execution. In CheerpJ, runtime components are JavaScript modules that are loaded on demand, only if required.

The CheerpJ runtime is highly optimised to minimise the total download size of an 'average' application, totalling 10-20MB of data for a typical download (as a point of comparison, the approximate size of the Java runtime installer is over 60MB). All downloaded components of CheerpJ are cached by the browser, which reduces the download time in subsequent executions of a same application.

This page provides a list of recommendations to reduce the one-time download size, and the resulting application first startup time.

## Preload resources

CheerpJ cannot predict which runtime resources will be required by an arbitrary application. CheerpJ runtime resources are therefore loaded on demand, one after the other, depending on the requirements of the application at run time.

To take advantage of parallel downloads, and reduce download and startup time of a specific application in production, CheerpJ allows to pre-specify a list of resources (CheerpJ runtime modules) to be loaded at startup.

This list of resources is to be specified manually when starting the CheerpJ environment in an HTML page. We also provide a simple profiling tool to automatically record and output a list of used resources during the execution of an application.

The function `cjGetRuntimeResources()` returns a JavaScript string representing the data that should be passed to [preloadResources](#preloadResources). Once parsed, it is an object containing the filenames that have been loaded from the runtime up to the time this function is called.

Modify the CheerpJ integration to enable preloading. You will only need to change the `cheerpjInit` call, to pass the `preloadResources` option. For example:

```js
cheerpjInit({ preloadResources: JSON.parse(cjGetRuntimeResources()) });
```

See [here](/cheerpj3/reference/Runtime-API#preloadresources) for more information.

When preloading is enabled CheerpJ will be able to download multiple resources in parallel with the execution of the program. This will greatly improve loading time.
