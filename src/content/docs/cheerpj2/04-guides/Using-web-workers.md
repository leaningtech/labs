---
title: Using web workers
---

## Using the JavaScript web workers API

CheerpJ supports running Java code in the background using Web Workers. To use this functionality you need to include the `loader.js` script as usual (e.g. `https://cjrtnc.leaningtech.com/latest/loader.js`). The script exposes the APIs described in [JavaScript web worker API](/cheerpj2/reference/WebWorker-API#javascript-web-worker-api). You can use CheerpJ in the main thread at the same time.

All code in a Worker runs in parallel and asynchronously with the main thread. All the methods below return standard JavaScript `Promise`s, and you can use `.then(...)`, `.catch(...)` and `async/await` with them.

### Creating and initializing a CheerpJ worker

The main entry point for CheerpJ workers is the `CheerpJWorker` JS interface. It is a normal JS object and it is possible to instantiate it multiple times.

```js
var w = new CheerpJWorker();
w.cheerpjInit().then(function (e) {
	console.log("CheerpJWorker is ready");
});
```

This starts the WebWorker and initializes CheerpJ in that context. All workers need to be initialized in this way. As a general rule the `CheerpJWorker` exposes the same API as CheerpJ in the main thread.

### Parameters and return values

Web workers do not share any memory with the main threads, and all interactions happen through messages. This imposes limitations on the type of data that can be passed around.

| Data type                                    | Limitations                                 |
| -------------------------------------------- | ------------------------------------------- |
| byte/short/char/int/float/double             | Fully supported in params and return values |
| byte[]/short[]/char[]/int[]/float[]/double[] | Fully supported in params and return values |
| JavaScript String                            | Supported in params, not return values      |
| Any Java object                              | Not supported in params or return values    |

Java arrays can either come from another Java method or they can be generated from a JS TypedArray using [cjTypedArrayToJava](/cheerpj2/reference/Runtime-API#cjtypedarraytojava).

It is possible to move Java arrays from the main thread and others `CheerpJWorker`s. Please note that Java arrays are not copied, but _transferred_ across contexts. This increases efficiency, but also means that the data is not available any more from the calling thread. If the data needs be preserved you must manually make a copy.

Java Strings, being Java objects, cannot be passed or returned. But JavaScript strings can be used as parameters and will be converted to Java Strings directly in the WebWorker context.

## Using the Java API for web workers

CheerpJ exposes a custom API to access this feature directly from Java code. The API is equivalent in terms of capabilities. This API is blocking, so to actually take advantage of concurrency between the main thread and Web Workers it is necessary to use this API from a Java thread.

The Java version of the API is also extended to support `long`s in parameters and returned values. Currently they are converted to native JS values when passed to Workers, so their range is limited to +/-2^52.

See the reference for [Java web worker API](/cheerpj2/reference/WebWorker-API#java-web-worker-api)

Example usage:

```java title="WW.java"
import com.leaningtech.cheerpj.Worker;

public class WW
{
        public static void main(String[] args)
        {
                Worker w = new Worker();
                w.runMain("Hello", "");
        }
}
```

To build the class you need to add `cheerpj-public.jar` to the classpath

```shell
javac -cp cheerpj_install_dir/cheerpj-public.jar WW.java
```

## Further reading

- [Web worker APIs (reference)](/cheerpj2/reference/WebWorker-API)
