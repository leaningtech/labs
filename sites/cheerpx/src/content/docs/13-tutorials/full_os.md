---
title: Full OS
description: Run bash on a custom disk image
---

This tutorial will guide you through creating a custom filesystem from scratch and using it with CheerpX.

## 1. Create an Ext2 image

We will create an Ext2 image, which will serve as the root filesystem for CheerpX.

To ensure consistency in preparing the image contents, we will use a Dockerfile, you can edit the Dockerfile to add custom packages or change the base to the distro of your choosing. It's important to select the `i386` architecture, since CheerpX does not currently support 64-bit executables.

```dockerfile title=Dockerfile
FROM --platform=i386 docker.io/i386/debian:buster
ARG DEBIAN_FRONTEND=noninteractive
RUN useradd -m user && echo "user:password" | chpasswd
RUN echo 'root:password' | chpasswd
CMD [ "/bin/bash" ]
```

> [!note] Note
> Creating a user named "user" inside the Dockerfile is mandatory for WebVM to work as expected. Without this user, the environment might not function properly.

Create a container out of your Dockerfile:

```bash
buildah build -f Dockerfile --dns=none --platform linux/i386 -t cheerpximage
podman create --name cheerpxcontainer cheerpximage
```

Copy the filesystem from the container into a local directory:

```bash
mkdir cheerpXFS
podman unshare podman cp cheerpxcontainer:/ cheerpXFS/
```

Create an ext2 image from the specified directory:

```bash
podman unshare mkfs.ext2 -b 4096 -d cheerpXFS/ cheerpXImage.ext2 600M
```

Learn more about creating a image in the [custom-disk-images] guide.

## 2. Load CheerpX from your index.html

Loading CheerpX is very simple. Create a new file called `index.html` and populate it with the following HTML code.

```html title=index.html
<!doctype html>
<html lang="en" style="height: 100%;">
	<head>
		<meta charset="UTF-8" />
		<title>CheerpX Test</title>
		<script src="https://cxrtnc.leaningtech.com/%CX_LATEST%/cx.js"></script>
	</head>
	<body style="height: 100%; background: black;"></body>
</html>
```

## 3. Setup a Web server

We recommend always choosing `nginx` as your Web server when using with CheerpX.

This basic configuration should get you up and running. Please note that CheerpX requires cross-origin isolation, which is enabled via the `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers. For more information see the dedicated [Nginx](/docs/guides/nginx) guide.

```nginx title=nginx.conf
worker_processes  1;
error_log   nginx_main_error.log info;
pid nginx_user.pid;
daemon off;

events {
    worker_connections  1024;
}

http {
    default_type  application/octet-stream;
    access_log nginx_access.log;
    error_log nginx_error.log info;

    sendfile on;

    server {
        listen 8080;
        server_name localhost;

        gzip on;
        gzip_types application/javascript application/wasm text/plain;

        charset utf-8;

        location / {
            root .;
            index  index.html index.htm;
            add_header 'Cross-Origin-Opener-Policy' 'same-origin' always;
            add_header 'Cross-Origin-Embedder-Policy' 'require-corp' always;
        }
    }
}
```

Run nginx with the following command:

```bash
nginx -p . -c nginx.conf
```

You can now see your page at `http://localhost:8080`

Make sure the `cheerpXImage.ext2` and the `index.html` files are both in the same directory where `nginx` was started.

## 4. Create a device for the filesystem

Add a new `<script>` tag with the `type="module"`. Having the script as a module is convenient to use top-level awaits.

Create a `HttpBytesDevice` from the just created Ext2 image. `OverlayDevice` makes it possible to make changes to the image, that are overlayed and saved in an IndexedDB persisted by the browser.

```html
<script type="module">
	var blockDevice = await CheerpX.HttpBytesDevice.create("/cheerpXImage.ext2");
	var overlayDevice = await CheerpX.OverlayDevice.create(
		blockDevice,
		await CheerpX.IDBDevice.create("block1")
	);
</script>
```

For more information on `HttpBytesDevice` and `OverlayDevice`, see our [Files and filesystem] guide.

## 5. Create a CheerpX instance

In the same script tag, pass the `overlayDevice` as a new mount point to the `Cheerpx.Linux.create` method. This option will initialize CheerpX with the newly created device mounted as `/`.

```js
const cx = await CheerpX.Linux.create({
	mounts: [{ type: "ext2", path: "/", dev: overlayDevice }],
});
```

To learn more about `Cheerpx.Linux.create`, see the [CheerpX.Linux.create] reference.

## 6. Attach a console

Create a console element for the output of your program.

```html
<pre id="console" style="height: 100%;"></pre>
```

And configure CheerpX to use it by adding this snippet at the end of the script.

```js
cx.setConsole(document.getElementById("console"));
```

Learn more about the console setup in the [setConsole] reference.

## 7. Execute a shell

Use the `cx.run` API to execute the `bash` shell. This setup is very similar to what we use for [WebVM](https://webvm.io)!

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

Learn more about `cx.run` in the [CheerpX.Linux.run] reference.

[Files and filesystem]: /docs/guides/File-System-support
[CheerpX.Linux.create]: /docs/reference/CheerpX.Linux/create
[setConsole]: /docs/reference/CheerpX.Linux/setConsole
[CheerpX.Linux.run]: /docs/reference/CheerpX.Linux/run
[custom-disk-images]: /docs/guides/custom-images
