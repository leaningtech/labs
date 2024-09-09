---
title: Quickstart
description: Getting started with CheerpX
---

## What CheerpX Does

**CheerpX is an x86 virtualization technology for running executables and operating systems entirely client-side.** Upon completing the steps below, you’ll be able to run Linux executables right within your web browser!

## 1. Include CheerpX on your page

No installation is needed. Simply include CheerpX by adding the following script tag in the `<head>` or at the end of the `<body>` section of your HTML:

```html
<script src="%CHEERPX_LATEST%"></script>
```

CheerpX's API is still in the works, so we are not tagging releases yet. All [nightly builds](https://t2informatik.de/en/smartpedia/nightly-build/) are immutable so you can trust that the URL above will not break.

## 2. Create an application instance

To start using CheerpX, create an instance by calling the [`CheerpX.Linux.create`](/docs/reference/CheerpXApp-create) method, which is available globally once the script is included.

The example below demonstrates how to set up the file system and devices using [WebVM's `debian_large` image](https://github.com/leaningtech/webvm/blob/main/dockerfiles/debian_large)[^compat], but you can also [create your own images](/docs/guides/custom-devices).

```html
<script type="module">
	const overlayDevice = await CheerpX.OverlayDevice.create(
		await CheerpX.HttpBytesDevice.create(
			"https://disks.webvm.io/debian_large_20230522_5044875331.ext2",
		),
		await CheerpX.IDBDevice.create("block1"),
	);
	const webDevice = await CheerpX.WebDevice.create("");
	const dataDevice = await CheerpX.DataDevice.create();

	const cx = await CheerpX.Linux.create({
		mounts: [
			{ type: "ext2", path: "/", dev: overlayDevice },
			{ type: "tree", path: "/app", dev: webDevice },
			{ type: "tree", path: "/data", dev: dataDevice },
			{ type: "devs", path: "/dev" },
		],
	});
</script>
```

> [!tip]
> You can just call CheerpX.Linux.create(); It will create a WebDevice to the root of your server, which will be mounted as root. It is then possible to call cx.run() with a program stored in the root of your server, as long as it is a statically linked executable that doesn't do anything fancy with the filesystem, such as write files etc.

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

To be able to see the output printed by the program, use [`setConsole`](/docs/reference/CheerpXApp-setConsole) method to use an HTML element as a console.

```html {1,4}
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpX.Linux.create()(/* ... */);
	cx.setConsole(document.getElementById("console"));
</script>
```

To be able to interact with the console, integrate with [xterm.js](https://xtermjs.org/) or similar software, and use [`setCustomConsole`](/docs/reference/CheerpXApp-setCustomConsole) method. The following example shows how this can be achieved using `xterm.js` in [WebVM](https://webvm.io).

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

Now let's include this script inside a <script type="module"> tag to [`run`](/docs/reference/CheerpXApp-run) bash using CheerpX!

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
