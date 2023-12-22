---
title: Quickstart
description: Getting started with CheerpX
---

## 1. Include the CheerpX library on your page

```html
<script src="%CHEERPX_LATEST%"></script>
```

CheerpX's API is still in the works, so we are not tagging releases yet. All nightly builds are immutable so you can trust that the URL above will not break.

## 2. Create a CheerpX application instance

CheerpX is exposed in a global object called `CheerpXApp`. To create an instance, call the [`create`](/cheerpx/reference/CheerpXApp-create) method.

The example below uses [WebVM's `debian_large` image](https://github.com/leaningtech/webvm/blob/main/dockerfiles/debian_large), but you can also [create your own images](/cheerpx/guides/custom-devices).

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

### As an HTML element

Use the `setConsole` method to use an HTML element as a console.

```html
<pre id="console"></pre>
<script type="module">
	const cx = await CheerpXApp.create(/* ... */);
	cx.setConsole(document.getElementById("console"));
</script>
```
