---
title: Runtime API
---

CheerpJ exposes a simple JavaScript API to interact with a Java application compiled to JavaScript. This API can be use to initialise CheerpJ, invoke Java methods, convert data and to enable/disable certain debugging features.

## Runtime initialization

### cheerpjInit

`cheerpjInit` must be called once in the page to setup and initialise the CheerpJ runtime environment. `cheerpjInit()` accepts an optional object argument which can be used to set options.

| **Parameters**       | **Type**                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------- |
| options (optional)   | object                                                                                       |
| **_Key_**            | **_value_**                                                                                  |
| version              | number                                                                                       |
| fetch                | (url: string, method: string, postData: ArrayBuffer, headers: unknown[]) => Promise<unknown> |
| status               | "splash" or "none" or"default"                                                               |
| logCanvasUpdates     | boolean                                                                                      |
| preloadResources     | { [key: string]: number[] }                                                                  |
| clipboardMode        | "permission" or "system" or "java"                                                           |
| beepCallback         | () => void                                                                                   |
| enableInputMethods   | boolean                                                                                      |
| overrideShortcuts    | (evt: KeyboardEvent) => boolean                                                              |
| appletParamFilter    | (originalName: string, paramValue: string) => string                                         |
| natives              | { [method: string]: Function }                                                               |
| overrideDocumentBase | string                                                                                       |
| javaProperties       | string[]                                                                                     |
| tailscaleControlUrl  | string                                                                                       |
| tailscaleDnsUrl      | string                                                                                       |
| tailscaleAuthKey     | string                                                                                       |
| tailscaleLoginUrlCb  | () => void                                                                                   |
| **Returns**          | Promise\<void>                                                                               |

This method is to be invoked as follows:

```js
cheerpjInit({ option: "value" });
```

Options are described below.

#### `clipboardMode`

By default CheerpJ supports an internal clipboard which is local to the Java application and is not integrated with the system clipboard. To change this behaviour you can initialize CheerpJ in the following way:

```js
cheerpjInit({ clipboardMode: "system" });
```

In `system` mode CheerpJ will share the clipboard with the system. Browsers enforce serious limitations on how the system clipboard can be accessed. In practice it is generally accessible when the `Ctrl+C` and `Ctrl+V` shortcuts are used (`Cmd+C` and `Cmd+V` on MacOSX). Due to these limitations the UX when using `clipboardMode:"system"` is:

- `Ctrl+C`/`Cmd+C`: the user has to press the shortcut twice to give CheerpJ access to the system clipboard. CheerpJ will block the execution while waiting for the second `Ctrl+C`.
- `Ctrl+V`/`Cmd+V`: this shortcut behaves normally, there is no difference with native execution.
- Menu based Copy/Paste: `Ctrl+C`/`Ctrl+V` are needed to access the clipboard. CheerpJ will block the execution while waiting the appropriate shortcut.

#### `enableInputMethods`

When this option is set to `true` CheerpJ will be able to receive text input from the input method framework of the platform. This is useful to support text input for languages such as Chinese, Japanese and Korean.

```js
cheerpjInit({ enableInputMethods: true });
```

#### `javaProperties`

An array of Java properties in the form `"key=value"`. They will be defined on the System object (System properties). This option should be used if command line arguments in the form `-Dkey=value` are required when using native Java.

Example usage:

```js
cheerpjInit({ javaProperties: ["prop1=value1", "prop2=value2"] });
```

#### `logCanvasUpdates`

When set to `true`, it enables logs on the console about the display areas which are being updated. Useful to debug overdrawing.

Example:

```js
cheerpjInit({ logCanvasUpdates: true });
```

#### `overrideShortcuts`

Some applications needs to internally handle keyboard shortcuts which are also used by the browser, for example Ctrl+F. Most users expect the standard browser behavior for these shortcuts and CheerpJ does not, by default, override them in any way.

A CheerpJ-compiled application can take control of additional shortcuts by providing a callback function as the `overrideShortcuts` options of `cheerpjInit`. This callback receives the `KeyboardEvent` coming from the browser and should return `true` if the default browser behaviour should be prevented.

Whenever possible we recommend _not_ to use browser reserved shortcuts, to maintain a consistent user experience. In any case, the following limitations apply:

- Some shortcuts (Ctrl+T, Ctrl+N, Ctrl+W) are reserved by the browser and never received by the page itself. These _cannot_ be overridden
- Overriding (Ctrl+C/Ctrl+V) will prevent `clipboardMode:"system"` from working correctly.

Example:

```js
cheerpjInit({
	overrideShortcuts: function (e) {
		// Let Java handle Ctrl+F
		if (e.ctrlKey && e.keyCode == 70) return true;
		return false;
	},
});
```

#### `preloadResources`<a name="preloadResources"></a>

By using `preloadResources`, you can provide CheerpJ with a list of runtime files which you know in advance will be required for the specific application. The list should be given as a JavaScript array of strings.

Example:

```js
cheerpjInit({ preloadResources: {"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]} });
```

See also [cjGetRuntimeResources](#cjGetRuntimeResources).

#### `status`

This option determines the level of verbosity of CheerpJ in reporting status updates.

- `"default"`: Enables status reporting during initialization and short-lived "Loading..." messages every time new runtime code is being downloaded.
- `"splash"`: Enabled status reporting only during initialization. There will be no feedback after the first window is shown on screen.
- `"none"`: Disable all status reporting.

Example:

```js
cheerpjInit({ status: "splash" });
```

#### `appletParamFilter`

Some applications may need to have some parameter modified before getting those inside the applet.

Example:

```js
cheerpjInit({
	appletParamFilter: function (name, value) {
		if (name === "httpServer") return value.replace("http", "https");
		return value;
	},
});
```

## Graphics

### cheerpjCreateDisplay

This method will create the HTML element that will contain all Java windows. It is only required to run graphical applications.

| **Parameters**    | **Type**    |
| ----------------- | ----------- |
| width             | number      |
| height            | number      |
| parent (optional) | HTMLElement |
| **Returns**       | HTMLElement |

```js
cheerpjCreateDisplay(width, height, /*optional*/ parent);
```

The `width` and `height` parameter represent the display area size in CSS pixels. It is also possible to specify a parent element if required, if a parent element is not specified the display area will be appended to the page `body` element. If a parent is specified it is also possible to pass `-1` to both `width` and `height`, in that case the size will correspond to the parent size and it will also change dynamically if the parent is modified by either CSS changes or browser window resize.

## Running applications and `.jar`(s)

**Warning**: CheerpJ does not support opening the HTML pages directly from disk. If the URL in your browser starts with `file://`, CheerpJ will not run. You _must_ use a local Web server.

### cheerpjRunMain

The most common way of starting an application is to use the `cheerpjRunMain` API, which lets you execute the static main method of a Java class in the classpath.

| **Parameters** | **Type**          |
| -------------- | ----------------- |
| className      | string            |
| classPath      | string            |
| ...args        | string[]          |
| **Returns**    | Promise\<unknown> |

Example:

```js
cheerpjRunMain(
	"fully.qualified.class.name",
	"/app/my_application_archive.jar:/app/my_dependency_archive.jar",
	arg1,
	arg2,
);
```

### cheerpjRunJar

If your JAR is designed to be executed with `java -jar my_application_archive.jar`, you can use this simpler API.

| **Parameters** | **Type**          |
| -------------- | ----------------- |
| jarName        | string            |
| ...args        | string[]          |
| **Returns**    | Promise\<unknown> |

```js
cheerpjRunJar("/app/my_application_archive.jar", arg1, arg2);
```

### cheerpjRunJarWithClasspath

This method is used to run your JAR if it also needs additional dependencies.

| **Parameters**  | **Type**          |
| --------------- | ----------------- |
| jarName         | string            |
| jarDependencies | string            |
| ...args         | string[]          |
| **Returns**     | Promise\<unknown> |

Example:

```js
cheerpjRunJarWithClasspath(
	"/app/my_application_archive.jar",
	"/app/my_dependency_archive.jar",
	arg1,
	arg2,
);
```

In all cases the arguments should be JavaScript Strings.

### cheerpjRunLibrary

| **Parameters** | **Type**          |
| -------------- | ----------------- |
| classPath      | string            |
| **Returns**    | Promise\<unknown> |

## Preloading

### cjGetRuntimeResources<a name="cjGetRuntimeResources"></a>

| **Parameters** | **Type** |
| -------------- | -------- |
| None           |          |
| **Returns**    | string   |

Returns a JavaScript string representing the data that should be passed to [preloadResources](#preloadResources). Once parsed, it is an object containing the filenames that have been loaded from the runtime up to the time this function is called.

Output example:

```js
'{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}';
```

## Filesystem

### cjFileBlob

Used to download files from the CheerpJ filesystem. It returns a promise that eventually resolve to a Blob object, which can be downloaded with standard HTML5 techniques.

| **Parameters** | **Type**       |
| -------------- | -------------- |
| fileName       | string         |
| **Returns**    | Promise\<Blob> |

### cheerpjAddStringFile

`cheerpjAddStringFile(fileName, str)`

| **Parameters** | **Type** |
| -------------- | -------- |
| fileName       | string   |
| text           | string   |
| **Returns**    | void     |

Used to add files into the `/str/` mount point filesystem.

Example:

```js
cheerpjAddStringFile("/str/fileName.txt", "Some text in a JS String");
```

## Tracing

### cjGetProguardConfiguration

To be used on the browser console to download a ProGuard configuration file (`cheerpj.pro`).

| **Parameters** | **Type** |
| -------------- | -------- |
| None           |          |
| **Returns**    | void     |
