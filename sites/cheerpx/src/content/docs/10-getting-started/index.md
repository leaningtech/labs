---
title: Quickstart
description: Getting started with CheerpX
---

## What CheerpX Does

**CheerpX is an x86 virtualization technology for running executables and operating systems entirely client-side.** Upon completing the steps below, you’ll be able to run Linux executables right within your web browser!

## 1. Include CheerpX on your page

No installation is needed. Simply include CheerpX by adding the following script tag in the `<head>` or at the end of the `<body>` section of your HTML:

```html
<script src="https://cxrtnc.leaningtech.com/0.9.1/cx.js"></script>
```

The CheerpX's API is stable and breaking changes can only be introduced on a new major version. All CheerpX builds are immutable so you can trust that, if your application works today, it is going to work identically forever.

### ES6 Module Compatibility

CheerpX is also available as an ES6 JavaScript module. If you prefer to use the ES6 module version, you can include it like this:

```html
<script type="module">
	import * as CheerpX from "https://cxrtnc.leaningtech.com/0.9.0/cx.esm.js";
	self.CheerpX = CheerpX;
</script>
```

This approach allows you to use CheerpX as an ES6 module in your project. Note that when using the ES6 module version, you'll need to adjust your code slightly to use the imported `CheerpX` object.

> [!tip]
> The examples in this documentation use the traditional script inclusion method. If you're using the ES6 module version, you may need to adapt the code examples accordingly.

## 2. Create an application instance

To start using CheerpX, create an instance by calling the [`CheerpX.Linux.create`](/docs/reference/CheerpX-Linux-create) method, which is available globally once the script is included.

The example below demonstrates how to set up the file system and devices using [WebVM's `debian_large` image](https://github.com/leaningtech/webvm/blob/main/dockerfiles/debian_large)[^compat], but you can also [create your own images](/docs/guides/custom-devices).

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>CheerpX test</title>
    <script src="https://cxrtnc.leaningtech.com/0.9.1/cx.js"></script>
    <script type="module">
      // The read-only disk image from Leaning Technologies' fast cloud backend
      const cloudDevice = await CheerpX.CloudDevice.create("wss://disks.webvm.io/debian_large_20230522_5044875331.ext2");
      // Read-write local storage for disk blocks, it is used both as a cache and as persisteny writable storage
      const idbDevice = await CheerpX.IDBDevice.create("block1");
      // A device to overlay the local changes to the disk with the remote read-only image
      const overlayDevice = await CheerpX.OverlayDevice.create(idbDevice, cloudDevice);
      // Direct acces to files in your HTTP server
      const webDevice = await CheerpX.WebDevice.create("");
      // Convenient access to JavaScript binary data and strings
      const dataDevice = await CheerpX.DataDevice.create();

      const cx = await CheerpX.Linux.create({
        mounts: [
          { type: "ext2", path: "/", dev: overlayDevice },
          { type: "dir", path: "/app", dev: webDevice },
          { type: "dir", path: "/data", dev: dataDevice },
          { type: "devs", path: "/dev" },
        ],
      });
    </script>
  </head>
  <body>
  </body>
</html>
```

> [!tip]
> This example is inteded to quickly get you up-and-running using a pre-deployed disk image from our cloud backend, for a much more self-contained example please see the [Simple Executable tutorial](/docs/tutorials/simple-executable)

## 3. Enable cross-origin isolation

CheerpX requires [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), which requires the site to be cross-origin isolated. To enable cross-origin isolation, serve over HTTPS and set the following headers:

```yaml
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

During development, you don't need to set these headers if you're using `localhost` as the origin. However, you'll need to set them and make sure you serve over HTTPS when you deploy.

> [!warning] Cross-origin isolation may break existing site functionality
> Cross-origin isolation is a security feature that you probably want to enable anyway, however it may impact your site in unexpected ways. For example, if you're embedding third-party iframes or opening cross-origin popup windows, you may need to make changes to your site to make them work. Test carefully!

## 4. Attach and interact with a console

To be able to see the output printed by the program, use [`setConsole`](/docs/reference/CheerpX-Linux-setConsole) method to use an HTML element as a console.

```html {1,4}
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpX.Linux.create()(/* ... */);
	cx.setConsole(document.getElementById("console"));
</script>
```

To be able to interact with the console, integrate with [xterm.js](https://xtermjs.org/) or similar software, and use [`setCustomConsole`](/docs/reference/CheerpX-Linux-setCustomConsole) method. The following example shows how this can be achieved using `xterm.js` in [WebVM](https://webvm.io).

```js
const term = new Terminal({ convertEol: true });
term.open(document.getElementById("terminal"));

const send = cx.setCustomConsole(
	(buf) => {
		term.write(new Uint8Array(buf));
	},
	term.cols,
	term.rows,
);
term.onData((str) => {
	for (let i = 0; i < str.length; i++) {
		send?.(str.charCodeAt(i));
	}
});
```

## 5. Run an executable

Now let's include this script inside a <script type="module"> tag to [`run`](/docs/reference/CheerpX-Linux-run) bash using CheerpX!

```js
await cx.run("/bin/bash", ["--login"], {
	env: [
		"HOME=/home/user",
		"USER=user",
		"SHELL=/bin/bash",
		"EDITOR=vim",
		"LANG=en_US.UTF-8",
		"LC_ALL=C",
	],
	cwd: "/home/user",
	uid: 1000,
	gid: 1000,
});
```

Now you can interact with the console to run commands. 🎉

---

[^compat]: A virtual system image, such as `debian_large`, is a complete snapshot of an operating system's files and configurations. CheerpX uses this image to simulate a Linux environment within your browser, allowing it to execute applications as if they were running on a native Linux system.
