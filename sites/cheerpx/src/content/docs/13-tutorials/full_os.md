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

## 2. Include CheerpX

Create an index.html file and add this line to index.html `<head>` section to include CheerpX.

```html
<script src="https://cxrtnc.leaningtech.com/0.8.4/cx.js"></script>
```

## 3. Serve the filesystem and index.html

The ext2 image needs to be served with [CORS] headers.

This example nginx.conf is set up with the correct headers.

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

error_log   nginx_main_error.log info;
pid nginx_user.pid;
daemon off;

http {
    access_log  nginx_access.log;
    error_log   nginx_error.log info;

    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    server {
	listen       8081;
        server_name  localhost;

	gzip on;
        # Enable compression for .wasm, .js and .txt files (used for the runtime chunks)
	gzip_types      application/javascript application/wasm text/plain application/octet-stream;

        charset utf-8;

        location / {
            root .;
            autoindex on;
            index  index.html index.htm;
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Expose-Headers' 'content-length' always;
            add_header 'Cross-Origin-Opener-Policy' 'same-origin' always;
            add_header 'Cross-Origin-Embedder-Policy' 'require-corp' always;
            add_header 'Cross-Origin-Resource-Policy' 'cross-origin' always;
        }

        location /images/ {
            root .;
            if ($arg_s != "") {
                rewrite ^/images/(.*)$ $1 break;
            }
            if ($arg_s = "") {
                gzip off;
            }
            error_page 404 =200 /images_slicer/$uri?$args;
        }

        location /images_slicer/ {
            proxy_pass       http://localhost:8082/images/;
            proxy_http_version 1.0;
            proxy_set_header Range bytes=$arg_s-$arg_e;
            proxy_hide_header Content-Range;
        }
    }

    server {
	listen       127.0.0.1:8082;
        server_name  localhost;

        charset utf-8;

        location / {
            root .;
        }
    }
}
```

Run nginx with the following command:

```bash
nginx -p . -c nginx.conf
```

You can now see your page at `http://localhost:8081`

Move ´cheerpXImage.ext2´ into a directory called images, so that this nginx configuration will serve it correctly.

## 4. Create a device for the filesystem

Add a new `<script>` tag with the type module into the index.html.

Create a `HttpBytesDevice(link)` from the ext2 image that was just created. `OverlayDevice(link)` makes it possible to make changes to the image, that are overlayed and saved in an IndexedDB layer that's persisted in the browser.

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

Pass the `overlayDevice` as a new mount point to the `Cheerpx.Linux.create` method. This option will tell CheerpX to take the device that was just created and mount it to `/`.

```js
const cx = await CheerpX.Linux.create({
	mounts: [{ type: "ext2", path: "/", dev: overlayDevice }],
});
```

## 6. Attach a console

Create a console element

```html
<pre id="console"></pre>
```

Bring in a terminal software of your choice. This example is done with [xterm.js]

Install xterm.js:

```bash
npm install @xterm/xterm
```

Add headers to index.html

```html
<link rel="stylesheet" href="node_modules/@xterm/xterm/css/xterm.css" />
<script src="node_modules/@xterm/xterm/lib/xterm.js"></script>
```

Create a new terminal instance

```js
var term = new Terminal({ convertEol: true });
term.open(document.getElementById("console"));
```

Pass xterm.js to the CheerpX instance

```js
const readFunc = cx.setCustomConsole(
	(data) => {
		term.write(new Uint8Array(data));
	},
	term.cols,
	term.rows,
);

term.onData((data) => {
	if (readFunc == null) return;
	for (let i = 0; i < data.length; i++) readFunc(data.charCodeAt(i));
});
```

## 7. Execute a program

The `cx.run` command will execute bash in the terminal that was created.

```js
await cx.run("/bin/bash", ["--login"], {
	env: [
		"HOME=/home/user",
		"TERM=xterm",
		"USER=user",
		"SHELL=/bin/bash",
		"EDITOR=vim",
		"LANG=en_US.UTF-8",
		"LC_ALL=C",
	],
	cwd: "/home/user",
	uid: "1000",
	gid: "1000",
});
```

From now you're able to interact with the filesystem.

[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
[xterm.js]: https://xtermjs.org/
