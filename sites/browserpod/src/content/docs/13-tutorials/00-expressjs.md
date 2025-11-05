---
title: Set up a basic NPM-based project
description: In this tutorial you will set up a simple NPM projext that serves an HTTP server using Express.js
---

## Prerequisites

- [Download the template project](/docs/browserpod/tutorials/expressjs.zip) and unzip it.
- [Set up an HTTP server with COEP and COOP headers](/docs/guides/nginx)

## Project structure

The project consists of the following files and directories:

```plaintext
expressjs/
├── index.html
└── project
    ├── main.js
    └── package.json
```


The `index.html` file is the main page that is using BrowserPod.

The `project` directory is the NPM-based project that we want to run inside our page.

It is a simple Express.js application that serves "hello world" over HTTP.

## NPM Project

```js title="package.json"
{
  "name": "expressjs-tutorial",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

```js title="main.js"
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

## BrowserPod setup: `index.html`

```html title="index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>BrowserPod ExpressJS Tutorial</title>
  </head>

  <body>
    <div id="url">Waiting for portal...</div>
    <iframe id="portal"></iframe>
    <div class="console" id="console"></div>
    <script type="module">
      import { BrowserPod } from "https://rt.browserpod.io/1.0/browserpod.js";
      // Utility function to copy files from the HTTP server into the Pod's
      // filesystem
      async function copy_file(pod, path) {
        const f = await pod.createFile("/"+path, "binary");
        const resp = await fetch(path);
        const buf = await resp.arrayBuffer();
        await f.write(buf);
        await f.close();
      }

      // Boot the Pod
      const pod = await BrowserPod.boot({apiKey:"your-api-key"});

      // Create a terminal and hook it to the console div.
      const terminalDiv = document.getElementById("console");
      const terminal = await pod.createDefaultTerminal(terminalDiv);

      // Hook the portal to the preview iframe on creation
      const portalIframe = document.getElementById("portal");
      const urlDiv = document.getElementById("url");
      pod.onPortal(({ url, port }) => {
        urlDiv.innerHTML = `Portal available at <a href="${url}">${url}</a> for local server listening on port ${port}`;
        portalIframe.src = url;
      });

      // Copy our project files
      await pod.createDirectory("/project");
      await copy_file(pod, "project/main.js");
      await copy_file(pod, "project/package.json");

      // Install dependencies
      await pod.run("/npm/bin/npm.js", ["install"], {terminal, cwd: "/project", echo:true});

      // Run the server
      await pod.run("/project/main.js", [], {terminal, cwd: "/project", echo:true});
    </script>
  </body>
</html>
```


## Source code

[View full source code on GitHub](https://github.com/leaningtech/browserpod-meta/tree/main/examples/expressjs)

