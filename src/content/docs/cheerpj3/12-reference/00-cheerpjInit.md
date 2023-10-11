---
title: cheerpjInit
description: Set up and initialize the CheerpJ runtime environment
---

`cheerpjInit` must be called once in the page to setup and initialise the CheerpJ runtime environment.

```ts
async function cheerpjInit(options?: {
	version?: number;
	fetch?: (
		url: string,
		method: string,
		postData: ArrayBuffer,
		headers: unknown[],
	) => Promise<unknown>;
	status?: "splash" | "none" | "default";
	logCanvasUpdates?: boolean;
	preloadResources?: { [key: string]: number[] };
	clipboardMode?: "permission" | "system" | "java";
	beepCallback?: () => void;
	enableInputMethods?: boolean;
	overrideShortcuts?: (evt: KeyboardEvent) => boolean;
	appletParamFilter?: (originalName: string, paramValue: string) => string;
	natives?: { [method: string]: Function };
	overrideDocumentBase?: string;
	javaProperties?: string[];
	tailscaleControlUrl?: string;
	tailscaleDnsUrl?: string;
	tailscaleAuthKey?: string;
	tailscaleLoginUrlCb?: (r: unknown) => void;
}): Promise<void>;
```

## Parameters

- **options (`object`, _optional_)** - Used to configure different settings of the CheerpJ runtime environment in the form `{ option: "value" }`.

| **Option**                                                                 | **Value expected type**                                                                        |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [`version`](/cheerpj3/reference/cheerpjInit#version)                       | `number`                                                                                       |
| [`fetch`](/cheerpj3/reference/cheerpjInit#fetch)                           | `(url: string, method: string, postData: ArrayBuffer, headers: unknown[]) => Promise<unknown>` |
| [`status`](/cheerpj3/reference/cheerpjInit#status)                         | `"splash" or "none" or"default"`                                                               |
| [`logCanvasUpdates`](/cheerpj3/reference/cheerpjInit#logcanvasupdates)     | `boolean`                                                                                      |
| [`preloadResources`](/cheerpj3/reference/cheerpjInit#preloadresources)     | `{ [key: string]: number[] }`                                                                  |
| [`clipboardMode`](/cheerpj3/reference/cheerpjInit#clipboardmode)           | `"permission" or "system" or "java"`                                                           |
| `beepCallback`                                                             | `() => void`                                                                                   |
| [`enableInputMethods`](/cheerpj3/reference/cheerpjInit#enableinputmethods) | `boolean`                                                                                      |
| [`overrideShortcuts`](/cheerpj3/reference/cheerpjInit#overrideshortcuts)   | `evt: KeyboardEvent) => boolean`                                                               |
| [`appletParamFilter`](/cheerpj3/reference/cheerpjInit#appletparamfilter)   | `(originalName: string, paramValue: string) => string`                                         |
| `natives`                                                                  | `{ [method: string]: Function }`                                                               |
| `overrideDocumentBase`                                                     | `string`                                                                                       |
| [`javaProperties`](/cheerpj3/reference/cheerpjInit#javaproperties)         | `string[]`                                                                                     |
| `tailscaleControlUrl`                                                      | `string`                                                                                       |
| `tailscaleDnsUrl`                                                          | `string`                                                                                       |
| `tailscaleAuthKey`                                                         | `string`                                                                                       |
| `tailscaleLoginUrlCb`                                                      | `() => void`                                                                                   |

## Returns

`cheerpjInit` returns a [Promise] which is resolved when the CheerpJ runtime environment is ready to be used.

## Examples

A description of each `cheerpjInit()` option with brief examples are given below.

### `version`

The Java runtime version to use. `8` is the only supported value at the moment.

### `clipboardMode`

By default CheerpJ supports an internal clipboard which is local to the Java application and is not integrated with the system clipboard. To change this behaviour you can initialize CheerpJ in the following way:

```js
cheerpjInit({ clipboardMode: "system" });
```

In `system` mode CheerpJ will share the clipboard with the system. Browsers enforce serious limitations on how the system clipboard can be accessed. In practice it is generally accessible when the `Ctrl+C` and `Ctrl+V` shortcuts are used (`Cmd+C` and `Cmd+V` on MacOSX). Due to these limitations the UX when using `clipboardMode:"system"` is:

- `Ctrl+C`/`Cmd+C`: the user has to press the shortcut twice to give CheerpJ access to the system clipboard. CheerpJ will block the execution while waiting for the second `Ctrl+C`.
- `Ctrl+V`/`Cmd+V`: this shortcut behaves normally, there is no difference with native execution.
- Menu based Copy/Paste: `Ctrl+C`/`Ctrl+V` are needed to access the clipboard. CheerpJ will block the execution while waiting the appropriate shortcut.

### `enableInputMethods`

When this option is set to `true` CheerpJ will be able to receive text input from the input method framework of the platform. This is useful to support text input for languages such as Chinese, Japanese and Korean.

```js
cheerpjInit({ enableInputMethods: true });
```

### `javaProperties`

An array of Java properties in the form `"key=value"`. They will be defined on the System object (System properties). This option should be used if command line arguments in the form `-Dkey=value` are required when using native Java.

Example usage:

```js
cheerpjInit({ javaProperties: ["prop1=value1", "prop2=value2"] });
```

### `logCanvasUpdates`

When set to `true`, it enables logs on the console about the display areas which are being updated. Useful to debug overdrawing.

Example:

```js
cheerpjInit({ logCanvasUpdates: true });
```

### `overrideShortcuts`

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

### `preloadResources`<a name="preloadResources"></a>

By using `preloadResources`, you can provide CheerpJ with a list of runtime files which you know in advance will be required for the specific application. The list should be given as a JavaScript array of strings.

Example:

```js
cheerpjInit({ preloadResources: {"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]} });
```

See also [cjGetRuntimeResources].

### `status`

This option determines the level of verbosity of CheerpJ in reporting status updates.

- `"default"`: Enables status reporting during initialization and short-lived "Loading..." messages every time new runtime code is being downloaded.
- `"splash"`: Enabled status reporting only during initialization. There will be no feedback after the first window is shown on screen.
- `"none"`: Disable all status reporting.

Example:

```js
cheerpjInit({ status: "splash" });
```

### `appletParamFilter`

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

### `fetch`

This option is used to make a `fetch` request over the network.

[cjGetRuntimeResources]: /cheerpj3/reference/cjGetRuntimeResources
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
