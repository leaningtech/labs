---
title: Basic Server Setup
description: How to serve your own Java application with CheerpJ
---

## Overview

To run a Java application in the browser with CheerpJ, its files must be served by an HTTP server. Opening the page from the local disk (`file://`) does not work. This guide covers a few one-line HTTP servers for local testing, and an NGINX configuration for more advanced setups, for example when self-hosting the CheerpJ runtime, which needs a [licence](https://cheerpj.com/licensing/).

> [!note] Important
> The configurations in this guide are for testing and are not meant for production. Production deployments must use HTTPS, both for security and because some browser APIs, such as the system clipboard, are only available in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts). See [deployment](https://cheerpj.com/deployment/) for production requirements.

## Static one-line servers

One-line HTTP servers run from the terminal with a short command. They are useful for serving static files and testing web applications locally.

One-line servers that have been tested with CheerpJ:

- `npx serve`
- `npx http-server`

## CheerpJ HTTP server requirements

### Range requests

CheerpJ uses [HTTP Range requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests) to download resources, such as JAR files, in chunks. The HTTP server hosting the application files must therefore support the `Range` header. Some servers need extra configuration to enable it, and others do not support it at all. Python's `http.server` module, often used for quick testing, does not support it, so CheerpJ cannot run from it.

If the HTTP server does not support the `Range` header, the browser console shows an error like this:

> [!warning] Network error for http://127.0.0.1:8084/exampleApp.jar: HTTP server does not support the 'Range' header. CheerpJ cannot run.

`npx serve` and `npx http-server` support range requests without extra configuration, so they are suitable for basic testing. So does NGINX, described [later in this guide](#nginx-guide).

### JavaScript library files

Native libraries can be implemented as JavaScript modules, as described in the [native libraries guide](/docs/guides/implementing-native-libraries).

Depending on the size of the JavaScript library file, some browsers, such as Firefox, may show this error:

> [!warning] Network error for http://localhost:8080/library.js: HTTP server returned compressed partial data. That should not happen. CheerpJ cannot run

Firefox sends the `Accept-Encoding: gzip` header with range requests, and some servers respond by compressing the partial response. This is not well defined: it is unclear whether the response contains part of the compressed file, or a compressed part of the file.

To resolve it, disable compression for range requests, or disable compression entirely. To disable compression in `npx serve`, use `npx serve -u`.

`npx http-server` serves JavaScript library files without compression by default.

## NGINX guide

This section does not cover installing NGINX. It covers the configuration NGINX needs to serve a CheerpJ application.

### NGINX configuration file

This NGINX configuration template works with most Java applications and CheerpJ for testing.

```nginx title=nginx.conf
worker_processes  1;
error_log   nginx_main_error.log info;
pid nginx_user.pid;
daemon off;

events {
	worker_connections  1024;
}

http {
	access_log  nginx_access.log;
	error_log   nginx_error.log info;

	default_type  application/octet-stream;

	sendfile        on;

	types {
		text/html html;
		text/css css;
		application/javascript js;
		application/wasm wasm;
	}

	server {
		listen       8080;
		server_name  localhost;

		gzip on;
		gzip_types      application/javascript application/wasm;

		charset utf-8;

		location / {
			# this should point to your root application folder
			root /home/path/to/java/app;

			autoindex on;
			absolute_redirect off;
			index  index.html index.htm;
		}
	}
}
```

The settings that matter for CheerpJ are described below.

The default MIME type for files with no other type is `application/octet-stream`. This marks the file as binary data, so the browser treats it as raw bytes instead of interpreting it as text or any other format.

```nginx
default_type  application/octet-stream;
```

The `types` block defines MIME types for the file extensions CheerpJ uses. NGINX uses it to set the `Content-Type` header of each response, so the browser interprets the content correctly.

```nginx
types {
	text/html html;
	text/css css;
	application/javascript js;
	application/wasm wasm;
}
```

The server block enables compression for `.js` and `.wasm` files, which make up most of the runtime.

```nginx
	gzip on;
	gzip_types      application/javascript application/wasm;
```

The location block turns off absolute redirects, so NGINX generates relative redirects.

```nginx
absolute_redirect off;
```

### Get rid of 404 not found messages

When self-hosting a runtime build of CheerpJ, the browser console may show `404 not found` messages for runtime files that do not exist. To avoid them, use the `try_files` directive.

```nginx {4}
	location / {
		root /home/path/to/cheerpj;
		autoindex on;
		try_files $uri $uri/ =204;
	}
```

With this `try_files` directive, NGINX returns a `204` status code for any file that is not found. This means that the request succeeded and there is no content to return.
