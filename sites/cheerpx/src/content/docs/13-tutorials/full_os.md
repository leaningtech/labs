---
title: Full OS
description: Run bash in a filesystem
---

This tutorial will explain how to create a full custom filesystem and work in it using CheerpX from scratch.

## 1. Creating a ext2 image

We're going to create a ext2 image. This image will be used as a filesystem. The image is going to be used with CheerpX from a Dockerfile.

First create a Dockerfile in i386:

```dockerfile
FROM --platform=i386 i386/debian:buster
ARG DEBIAN_FRONTEND=noninteractive
RUN useradd -m user && echo "user:password" | chpasswd
RUN echo 'root:password' | chpasswd
CMD [ "/bin/bash" ]
```

Create a container out of your Dockerfile:

```bash
buildah build -f Dockerfile --platform linux/i386 -t cheerpximage
podman create --name cheerpxcontainer cheerpximage
```

Copy the filesystem from the container into a local directory:

```bash
mkdir cheerpXFS
podman cp cheerpxcontainer:/ cheerpXFS/
```

Create an ext2 image from the specified directory:

```bash
mkfs.ext2 -b 4096 -d cheerpXFS/ cheerpXImage.ext2 600M
```

## 2. Include CheerpX in index.html

Create an index.html file and include CheerpX as a script.

```html
<!doctype html>
<html lang="en" style="heigth: 100%;">
	<head>
		<meta charset="UTF-8" />
		<title>CheerpX Test</title>
		<script src="https://cxrtnc.leaningtech.com/1.0.0/cx.js"></script>
	</head>
	<body style="heigth: 100%; background: black;"></body>
</html>
```

## 3. Serve the filesystem and index.html

This example nginx.conf is set up to serve the index.html with the correct headers for CheerpX.

```nginx
worker_processes  1;
error_log   nginx_main_error.log info;
pid nginx_user.pid;
daemon off;

events {
    worker_connections  1024;
}

http {
    default_type  application/octet-stream;
    access_log  nginx_access.log;
    error_log   nginx_error.log info;

    sendfile        on;

    server {
        listen       8080;
        server_name  localhost;

        gzip on;
        gzip_types application/javascript application/wasm text/plain application/octet-stream;

        charset utf-8;

        location / {
            root .;
            index  index.html index.htm;
            add_header 'Cross-Origin-Opener-Policy' 'same-origin' always;
            add_header 'Cross-Origin-Embedder-Policy' 'require-corp' always;
            add_header 'Cross-Origin-Resource-Policy' 'cross-origin' always;
        }
    }
}
```

Run nginx with the following command:

```bash
nginx -p . -c nginx.conf
```

You can now see your page at `http://localhost:8080`

Move ´cheerpXImage.ext2 into a directory called images, so that this nginx configuration will serve it correctly.

## 4. Create a device for the filesystem

Add a new `<script>` tag with the type module into the index.html.

Create a `HttpBytesDevice` from the ext2 image that was just created. `OverlayDevice` makes it possible to make changes to the image, that are overlayed and saved in an IndexedDB layer that's persisted in the browser.

```html
<script type="module">
	var blockDevice = await CheerpX.HttpBytesDevice.create(
		"images/cheerpXImage.ext2",
	);
	var overlayDevice = await CheerpX.OverlayDevice.create(
		blockDevice,
		await CheerpX.IDBDevice.create("block1"),
	);
</script>
```

## 5. Create a CheerpX instance

In the same script tag, pass the `overlayDevice` as a new mount point to the `Cheerpx.Linux.create` method. This option will tell CheerpX to take the device that was just created and mount it to `/`.

```js
const cx = await CheerpX.Linux.create({
	mounts: [{ type: "ext2", path: "/", dev: overlayDevice }],
});
```

## 6. Attach a console

Create a console element to see the output of your program.

```html
<pre id="console" style="heigth: 100%;"></pre>
```

Tell CheerpX to use the element as a console to write the program output to by adding this snippet at the end of the script.

```js
cx.setConsole(document.getElementById("console"));
```

## 7. Execute a program

Use `cx.run` to execute a program of your choosing.

```js
await cx.run("/bin/echo", ["Hello CheerpX!"]);
```

[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
