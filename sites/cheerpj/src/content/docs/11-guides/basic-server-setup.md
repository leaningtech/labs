---
title: Basic Server Setup
description: How do serve your own Java application with CheerpJ
---

## Overview

To run your Java applications in the browser, you will need to host the application files. This guide will cover some simple HTTP servers that can be used for basic testing. We will also discuss NGINX which is useful in more advanced scenarios, for example when self hosting CheerpJ.

> [!note] Important
> The content of this guide is specifically made for testing setups and should not be used for production environments. In production environments it is essential to utilize HTTPS, both to improve security and to gain access to advanced Web APIs.

## Static _One-Line_ servers

_One-Line_ HTTP servers are simple tools that can be run directly from the terminal with a short command. They are simple to set up and useful for quickly serving static files or testing web applications locally.

_One-Line_ servers that have been tested and work with CheerpJ:

- `npx serve`
- `npx http-server`

## CheerpJ HTTP server requirements

### Range requests

CheerpJ makes use of [Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Range_requests) to download resources in chunks, for example JAR files.
Thus, the HTTP server hosting the Java application files must support "Range" headers. Some HTTP servers may need additional configuration to enable this feature, while others are not compatible at all. For instance, Python's `http-server` module, commonly used for quick testing, lacks support for range headers and therefore won't work with CheerpJ.

If your HTTP server does not support "Range" headers, you will see an error message like this in the browser console:

> [!warning] Network error for http://127.0.0.1:8084/exampleApp.jar: HTTP server does not support the 'Range' header. CheerpJ cannot run.

NPM server tools such as `npx serve` and `npx http-server` typically have built-in support for range requests, making them suitable for basic testing without the need for additional configurations. The same applies to NGINX, which will be discussed in more detail later in this guide.

### JavaScript library files

CheerpJ allows you to implement native libraries in JavaScript, more details on this can be found in our [Native Libraries Guide](/docs/guides/implementing-native-librariest).

Depending on the size of the JavaScript library file, you may encounter an error with certain browsers, like Firefox:

> [!warning] Network error for http://localhost:8080/library.js: HTTP server returned compressed partial data. That should not happen. CheerpJ cannot run

This error occurs because plain JavaScript files are compressed automatically in Firefox, since it provides the `Accept-Encoding: gzip` header for range requests. This is not well defined, since it is unclear whether the response contains partial compressed data, or compressed partial data.

To resolve this issue, you need to disable compression for range requests or disable compression entirely. To disable compression in `npx serve`, use `npx serve -u`.

By default, `npx http-server` should correctly serve JavaScript library files without compression.

## NGINX Guide

We won't go into detail on how to install and setup NGINX, but will focus on the configuration necessary to integrate NGINX seamlessly with CheerpJ.

### Nginx configuration file

This NGINX configuration template will work with most Java applications and CheerpJ for testing purposes.

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

Let's take a closer look at some important settings required for CheerpJ and to also ensure proper file serving.

We specify the default MIME type for unspecified files as `application/octet-stream`. We do this to indicate that a file is binary data, instructing the server and client to treat the file as raw bytes instead of interpreting it as text or any other format.

```nginx
default_type  application/octet-stream;
```

Additionally we add a `types` block and define certain MIME types. Like this NGINX identifies the file type for each response and sets the corresponding `Content-Type` header in HTTP responses. This enables browsers and clients to interpret content accurately,

```nginx
types {
	text/html html;
	text/css css;
	application/javascript js;
	application/wasm wasm;
}
```

We also enable compression for `.wasm` and `.js` files, primarily used for the runtime chunks, within our server block.

```nginx
	gzip on;
	gzip_types      application/javascript application/wasm;
```

To ensure NGINX generates relative redirects, we disable the absolute redirect option within our location block.

```nginx
absolute_redirect off;
```

### Get rid of 404 not found messages

To get rid of `404 not found` browser console messages when self hosting a runtime build of CheerpJ, you can use the `try_files` option with NGINX.

```nginx {4}
	location / {
		root /home/path/to/cheerpj;
		autoindex on;
		try_files $uri $uri/ =204;
	}
```

With the `try_files` directive, NGINX will return a `204` status code for any files that are not found. This indicates that the request was processed successfully but no content is returned.
