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

For more information visit the [Using Web Workers](/cheerpj2/guides/Using-web-workers) guide.

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

## Java Web Worker API

### Worker

Initializes the Worker object, this method is blocking.

```java
Worker w = new Worker();

```

### runMain

Runs the main method of the given class in the Web Worker context, this method is blocking.

| Parameters                                        | Output |
| ------------------------------------------------- | ------ |
| String className, String classPath, Object... arg | None   |

```java

w.runMain("Hello", "");
```

### call / callI / callD / callL (for static method)

Runs the given static method in the Web Worker context, this method is blocking

callI, callD and callL should be used when primitives are expected.
| Method | Parameters | Output |
| ------ | ------------------------------------ | ------ |
| call | String className, String methodName, Object... arg | Object |
| callI | String className, String methodName, Object... arg | Int |
| callD | String className, String methodName, Object... arg | Double |
| callL | String className, String methodName, Object... arg | Long |

### resolveCall

Returns an handle to a resolved method, this method is blocking.
| Parameters | Output |
| ------------------------------------------------- | ------ |
| String className, String methodName, String[] types | Object |

### call / callI / WcallD / callL (for resolved method)

Runs the given resolved method handle in the Web Worker context, this method is blocking

| Method | Parameters                           | Output |
| ------ | ------------------------------------ | ------ |
| call   | Object resolvedFunc, , Object... arg | Object |
| callI  | Object resolvedFunc, , Object... arg | Int    |
| callD  | Object resolvedFunc, , Object... arg | Double |
| callL  | Object resolvedFunc, , Object... arg | Long   |

## Further reading

- [Using Web Workers (guide)](/cheerpj2/guides/Using-web-workers)
