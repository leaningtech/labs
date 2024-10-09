---
title: Basic server setup
description: Serve your own project using nginx
---

CheerpX requires [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), which itself requires the site to be cross-origin isolated. This means that the server must set the appropriate headers.

Here's an example of a basic nginx configuration that allows CheerpX to run.

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
        }
    }
}
```

This configuration will work over localhost in a development environment. When the application is deployed, it must be served over HTTPS.

Then run nginx using this configuration with the following command line.

```bash
nginx -c nginx.conf -p .
```
