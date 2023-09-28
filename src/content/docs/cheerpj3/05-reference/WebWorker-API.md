---
title: Web Worker APIs
---

## JavaScript Web Worker API

### CheerpJWorker

The main entry point for CheerpJ workers is the `CheerpJWorker` JS interface. It is a normal JS object and it is possible to instantiate it multiple times.

```js
var w = new CheerpJWorker();
w.cheerpjInit().then(function (e) {
	console.log("CheerpJWorker is ready");
});
```

For more information visit the [Using Web Workers](/cheerpj3/guides/Using-web-workers) guide.

### CheerpJWorker.cheerpjRunMain

`cheerpjRunMain(className, classPath, ...)`

Runs a Java main method in the WebWorker context

```js
w.cheerpjRunMain("ClassName", classPath, arg1, arg2).then(...)
```

### CheerpJWorker.cjCall

`cjCall(objOrClassNameOrInvoker, methodName, ...)`

Executes a static Java method in the WebWorker content

```js
w.cjCall("ClassName", "methodName", arg1, arg2).then(...)
```

### CheerpJWorker.cjResolveCall

`cjResolveCall(className, methodName, types)`

Uses Java reflection to resolve the method and returns an opaque handle to it. This handle can then be used multiple times without using Java reflection again.

```js
w.cjResolveCall("ClassName", "methodName", null).then( // or array of parameter types if methodName is not unique
        function(resolvedMethod) {
                        w.cjCall(resolvedMethod, arg1, arg2);
                        ...
        }
);
```

### CheerpJWorker.cjFileBlob

`cjFileBlob(fileName)`

Used to download files from the CheerpJ filesystem. It returns a promise that eventually resolve to a Blob object, which can be downloaded with standard HTML5 techniques.

### CheerpJWorkercheerpj.AddStringFile

`AddStringFile(fileName, str)`

Used to add files into the `/str/` mount point filesystem.

## Further reading

- [Using Web Workers (guide)](/cheerpj3/guides/Using-web-workers)
