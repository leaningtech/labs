---
title: Set CORS and COOP headers
description: Cross-origin isolation for BrowserPod (COOP and COEP)
---

BrowserPod requires **cross-origin isolation**, which depends on two headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

Without these headers, the browser will block `SharedArrayBuffer` and the pod will fail to boot.

## Development (Vite)

```js
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		headers: {
			"Cross-Origin-Embedder-Policy": "require-corp",
			"Cross-Origin-Opener-Policy": "same-origin",
		},
	},
});
```

## Production (nginx)

Create a file named `nginx.conf`:

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

Start nginx:

```bash
nginx -c nginx.conf -p .
```

## HTTPS requirement

In production, you must use HTTPS to enable cross-origin isolation. Localhost is the only exception and works over HTTP.
