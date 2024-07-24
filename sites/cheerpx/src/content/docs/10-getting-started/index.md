---
title: Quickstart
description: Getting started with CheerpX
---

## 1. Include CheerpX on your page

```html
<script src="%CHEERPX_LATEST%"></script>
```

CheerpX's API is still in the works, so we are not tagging releases yet. All nightly builds are immutable so you can trust that the URL above will not break.

## 2. Create an application instance

CheerpX is exposed in a global object called `CheerpXApp`. To create an instance, call the [`create`](/docs/reference/CheerpXApp-create) method.

The example below uses [WebVM's `debian_large` image](https://github.com/leaningtech/webvm/blob/main/dockerfiles/debian_large), but you can also [create your own images](/docs/guides/custom-devices).

```html
<script type="module">
	const cx = await CheerpXApp.create({
		devices: [
			{
				name: "block1",
				type: "block",
				url: "https://disks.webvm.io/debian_large_20230522_5044875331.ext2",
			},
		],
		mounts: [
			{ type: "ext2", dev: "block1", path: "/" },
			{ type: "cheerpOS", dev: "/app", path: "/app" },
			{ type: "cheerpOS", dev: "/str", path: "/data" },
			{ type: "devs", dev: "", path: "/dev" },
		],
	});
</script>
```

## 3. Enable cross-origin isolation

CheerpX requires [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), which requires the site to be cross-origin isolated. To enable cross-origin isolation, serve over HTTPS and set the following headers:

```yaml
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

During development, you don't need to set these headers if you're using `localhost` as the origin. However, you'll need to set them and make sure you serve over HTTPS when you deploy.

> [!warning] Cross-origin isolation may break existing site functionality
> Cross-origin isolation is a security feature that you probably want to enable anyway, however it may impact your site in unexpected ways. For example, if you're embedding third-party iframes or opening cross-origin popup windows, you may need to make changes to your site to make them work. Test carefully!

## 4. Attach a console

Use the [`setConsole`](/docs/reference/CheerpXApp-setConsole) method to use an HTML element as a console.

```html {1,4}
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpXApp.create(/* ... */);
	cx.setConsole(document.getElementById("console"));
</script>
```

## 5. Run an executable

Let's [`run`](/docs/reference/CheerpXApp-run) bash!

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
