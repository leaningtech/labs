---
title: cheerpjInit
description: Set up and initialize the CheerpJ runtime environment
---

`cheerpjInit` must be called once in the page to setup and initialise the CheerpJ runtime environment.

```ts
async function cheerpjInit(options?: {
	version?: number;
	status?: "splash" | "none" | "default";
	logCanvasUpdates?: boolean;
	preloadResources?: { [key: string]: number[] };
	preloadProgress?: (preloadDone: number, preloadTotal: number) => void;
	clipboardMode?: "permission" | "system" | "java";
	beepCallback?: () => void;
	enableInputMethods?: boolean;
	overrideShortcuts?: (evt: KeyboardEvent) => boolean;
	appletParamFilter?: (originalName: string, paramValue: string) => string;
	natives?: { [method: string]: Function };
	overrideDocumentBase?: string;
	javaProperties?: string[];
	tailscaleControlUrl?: string;
	tailscaleDnsIp?: string;
	tailscaleAuthKey?: string;
	tailscaleLoginUrlCb?: (url: string) => void;
	tailscaleIpCb?: (ip: string) => void;
	licenseKey?: string;
	execCallback?: (cmdPath: string, argsArray: string[]) => void;
	enableDebug?: boolean;
}): Promise<void>;
```

## Parameters

- **options (`object`, _optional_)** - Used to configure different settings of the CheerpJ runtime environment in the form `{ option: "value" }`.

## Returns

`cheerpjInit` returns a [Promise] which is resolved when the CheerpJ runtime environment is ready to be used.

## Options

A description of each `cheerpjInit()` option with brief examples are given below.

### `version`

```ts
version?: number;
```

The Java runtime version to use. `8` is the only supported value at the moment.

### `status`

```ts
status?: "splash" | "none" | "default";

```

This option determines the level of verbosity of CheerpJ in reporting status updates.

- `"default"`: Enables status reporting during initialization and short-lived "Loading..." messages every time new runtime code is being downloaded.
- `"splash"`: Enabled status reporting only during initialization. There will be no feedback after the first window is shown on screen.
- `"none"`: Disable all status reporting.

Example:

```js
cheerpjInit({ status: "splash" });
```

### `logCanvasUpdates`

```ts
logCanvasUpdates?: boolean;
```

When set to `true`, it enables logs on the console about the display areas which are being updated. Useful to debug overdrawing.

Example:

```js
cheerpjInit({ logCanvasUpdates: true });
```

### `preloadResources`<a name="preloadResources"></a>

```ts
preloadResources?: { [key: string]: number[] };
```

By using `preloadResources`, you can provide CheerpJ with a list of runtime files which you know in advance will be required for the specific application. The list should be given as a JavaScript array of strings.

Example:

```js
cheerpjInit({ preloadResources: {"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]} });
```

See also [cjGetRuntimeResources].

### `preloadProgress`<a name="preloadProgress"></a>

```ts
preloadProgress?: (preloadDone: number, preloadTotal: number) => void;
```

This callback may be used in combination with [`preloadResources`](#preloadresources) to monitor the loading of an application. The information provided is useful, for example, to display a loading/progress bar.

Example:

```js
function showPreloadProgress(preloadDone, preloadTotal) {
	console.log("Percentage loaded " + (preloadDone * 100) / preloadTotal);
}

await cheerpjInit({ preloadProgress: showPreloadProgress });
```

### `clipboardMode`

```ts
clipboardMode?: "permission" | "system" | "java";
```

This option allows you to configure how the clipboard will behave. Supported clipboard modes are [`java`], [`system`] and [`permission`].

Example:

```js
cheerpjInit({ clipboardMode: "system" });
```

#### `java` mode

This is the default setting. CheerpJ supports an internal clipboard which is local to the Java application and is not integrated with the system clipboard.

#### `system` mode

In `system` mode CheerpJ will share the clipboard with the system. Browsers enforce serious limitations on how the system clipboard can be accessed. In practice it is generally accessible when the `Ctrl+C` and `Ctrl+V` shortcuts are used (`Cmd+C` and `Cmd+V` on MacOSX). Due to these limitations the UX when using `clipboardMode:"system"` is:

- `Ctrl+C`/`Cmd+C`: the user has to press the shortcut twice to give CheerpJ access to the system clipboard. CheerpJ will block the execution while waiting for the second `Ctrl+C`.
- `Ctrl+V`/`Cmd+V`: this shortcut behaves normally, there is no difference with native execution.
- Menu based Copy/Paste: `Ctrl+C`/`Ctrl+V` are needed to access the clipboard. CheerpJ will block the execution while waiting the appropriate shortcut.

#### `permission` mode

With `permission` mode enabled, CheerpJ offers a more seamless integration than `system` mode. This includes support for images and HTML on top of plain text. Another important feature is that pressing extra `Ctrl+C`/`Ctrl+V` to perform copying and pasting operations is not required.

The first time an operation is requested, the user will be asked for permission to use the clipboard. If this permission is refused, a message will be prompted explaining this permission is necessary to continue.

> This mode is experimental and might show a few inconsistencies in some browsers. [`See more`](https://caniuse.com/mdn-api_permissions_permission_clipboard-read).

### `beepCallback`

```ts
beepCallback?: () => void;
```

This callback runs when `java.awt.Toolkit.getDefaultToolkit().beep()` is called in Java. It corresponds to the system's _beep_ sound.

Example of usage:

```js
cheerpjInit({
	beepCallback: function () {
		alert("Beep!");
	},
});
```

### `enableInputMethods`

```ts
enableInputMethods?: boolean;
```

When this option is set to `true` CheerpJ will be able to receive text input from the input method framework of the platform. This is useful to support text input for languages such as Chinese, Japanese and Korean.

```js
cheerpjInit({ enableInputMethods: true });
```

### `overrideShortcuts`

```ts
overrideShortcuts?: (evt: KeyboardEvent) => boolean;
```

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

### `appletParamFilter`

```ts
appletParamFilter?: (originalName: string, paramValue: string) => string;
```

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

### `natives`

```ts
natives?: { [method: string]: Function };
```

This option is used to implement native methods from an AOT-compiled language in JavaScript.

Example usage:

```js
cheerpjInit({
	natives: {
		async Java_MyClass_myMethod(lib, str) {
			window.alert(str);
		},
	},
});
```

Read more about implementing native methods [here](/docs/guides/Implementing-Java-native-methods-in-JavaScript).

### `overrideDocumentBase`

```ts
overrideDocumentBase?: string;
```

Replaces the current `<base>` URL of the document with the URL passed as a `string`.

Example usage:

```js
cheerpjInit({ overrideDocumentBase: "YourNewURLHere" });
```

### `javaProperties`

```ts
javaProperties?: string[];
```

An array of Java properties in the form `"key=value"`. They will be defined on the System object (System properties). This option should be used if command line arguments in the form `-Dkey=value` are required when using native Java.

Example usage:

```js
cheerpjInit({ javaProperties: ["prop1=value1", "prop2=value2"] });
```

### `tailscaleControlUrl`

```ts
tailscaleControlUrl?: string;
```

This option expects a string URL of the Tailscale control plane. The control plane verifies the user's identity and validates various keys among the connected peers in the network. Only pass this option if you are [self-hosting Tailscale](https://github.com/leaningtech/headscale), if omitted, it will point to the Tailscale control plane.

Example usage:

```js
cheerpjInit({ tailscaleControlUrl: "https://my.url.com/" });
```

### `tailscaleDnsUrl`

```ts
 tailscaleDnsUrl?: string;
```

Expects a string with the IPv4 or IPv6 address to use for DNS queries. If omitted, the default IP address is "8.8.8.8".

Example usage:

```js
cheerpjInit({ tailscaleDnsUrl: "1.1.1.1" });
```

### `tailscaleAuthKey`

```ts
tailscaleAuthKey?: string;
```

This option expects a string that contains a Tailscale auth key. Using auth keys allows one to register new users/devices that are pre-authenticated. You can create an auth key [here](https://login.tailscale.com/admin/settings/keys). This option is mutually exclusive with [`tailscaleLoginUrlCb`](#tailscaleloginurlcb)

> [!info] Info
> A combination of a user and a device connected to a Tailscale network is called a _"node"_ in Tailscale terminology.

For more information about auth keys visit the [Tailscale auth keys documentation](https://tailscale.com/kb/1085/auth-keys/).

Example of usage:

```js
cheerpjInit({ tailscaleAuthKey: "AuthKeyStringGoesHere" });
```

### `tailscaleLoginUrlCb`

```ts
tailscaleLoginUrlCb?: (url: string) => void;
```

This option is used to login into a Tailscale network and it is mutually exclusive with [`tailscaleAuthKey`](#tailscaleauthkey). It expects the base URL of a control server that will continue and finish the login process. This callback is executed when it is time to prompt the user to login to Tailscale via the UI.

For more information visit the [Tailscale documentation](https://tailscale.com/kb/1080/cli/#login).

```js
cheerpjInit({
	tailscaleLoginUrlCb(url) {
		// your function code here to continue with login
	},
});
```

### `tailscaleIpCb`

```ts
tailscaleIpCb?: (ip: string) => void;
```

This callback is used to retrieve the IP address of the client once the connection with the Tailscale network is established.

Example of usage:

```js
cheerpjInit({
	tailscaleIpCb: function (ip) {
		console.log("IP address " + ip);
	},
});
```

### `licenseKey`

```ts
licenseKey?: string;
```

This option expects a license key. The non-commercial license message will be removed from the CheerpJ display if a valid license key is used. Please visit our [licensing guide](/docs/licensing) for more information.

Example of usage:

```js
cheerpjInit({ licenseKey: "YourLicenseKey" });
```

### `execCallback`

```ts
execCallback?: (cmdPath: string, argsArray: string [])  => void;
```

> [!note] Important
> The `execCallback` option is supported in CheerpJ 3.1 and later versions.

This option allows you to intercept and handle external system commands or program executions that initiated from a Java application. Such commands are typically executed using methods like `Runtime.getRuntime().exec(command)` or `new ProcessBuilder(command)` in Java.

The callback function accepts two parameters:

- `cmdPath`: The command that would have been executed in Java.
- `argsArray`: An array of additional arguments passed to that command.

Example of usage:

```js
cheerpjInit({
	execCallback: function (cmdPath, argsArray) {
		debugger;
	},
});
```

Learn more about the `execCallback` option in our [intercept external commands guide](/docs/guides/Intercept-external-commands).

### `enableDebug`

```ts
enableDebug?: boolean;
```

> [!note] Important
> The `enableDebug` option is supported in CheerpJ 3.1 and later versions.

This option enables advanced debug logging, which is helpful for troubleshooting issues with CheerpJ.

Example of usage:

```js
cheerpjInit({ enableDebug: true });
```

Learn more about how to debug CheerpJ in our [Debugging CheerpJ guide](/docs/guides/cheerpj-debug).

[cjGetRuntimeResources]: /docs/reference/cjGetRuntimeResources
[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[`java`]: /docs/reference/cheerpjInit#java-mode
[`system`]: /docs/reference/cheerpjInit#system-mode
[`permission`]: /docs/reference/cheerpjInit#permission-mode
