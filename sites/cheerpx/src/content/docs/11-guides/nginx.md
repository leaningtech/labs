---
title: Basic server setup
description: Serve your own project using nginx
---

## Overview

This guide will help you set up a basic server using nginx to run your project with CheerpX. CheerpX requires [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), which itself requires the site to be cross-origin isolated. This means that the server must set the appropriate headers.

## Configuration Steps

### 1. Prepare Your Nginx Configuration

Create a file named `nginx.conf` and add the following configuration:

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

This is a basic nginx configuration that allows CheerpX to run.

### 2. Important notes

- This setup works in a **development environment** on `localhost`
- **For production**, always use **HTTPS** to ensure security.

### 3. Run Nginx

Use the following command to start nginx with your configuration:

```bash
nginx -c nginx.conf -p .
```
