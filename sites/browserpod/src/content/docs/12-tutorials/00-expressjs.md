---
title: Set up a basic NPM-based project
description: In this tutorial you will set up a simple NPM projext that serves an HTTP server using Express.js
---

## Prerequisites

- Clone the [browserpod-meta](https://github.com/leaningtech/browserpod-meta) repo and go to the `examples/expressjs` subdirectory.
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

The package.json is very minimal. express is the only dependency:

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

The application itself is just a basic web server that responds with "hello world".

It listens to tcp port 3000, which will be reachable via a Portal.

```js title="main.js"
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
```

## BrowserPod setup: `index.html`

The index.html file is more complex, so we will describe it in multiple steps,
and leave out irrelevant boilerplate. you can see it in full at the end.

### UI elements

Our simple page has 3 main UI elements:

```html title="index.html"
<div id="url">Waiting for portal...</div>
<iframe id="portal"></iframe>
<div class="console" id="console"></div>
```

The `url` div will be populated with the URL of the live view of our server.

The `portal` iframe will contain an embedded view of our server.

The `console` div will show the console output of our application.

### Import and initialize BrowserPod

```js
import { BrowserPod } from "https://rt.browserpod.io/%BP_LATEST%/browserpod.js";

const pod = await BrowserPod.boot({ apiKey: "your-api-key" });
```

This code imports BrowserPod and boots a Pod.

You will need a valid API key with at least 10 tokens available for the boot to succeed.

### Hook the pod to the UI

```js
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
```

This code creates a Terminal to use for console output, and sets up a callback
that populates the `url` div and `portal` iframe with the Portal data.

### Copy the project files into the Pod's filesystem

```js
// Utility function to copy files from the HTTP server into the Pod's
// filesystem
async function copy_file(pod, path) {
	const f = await pod.createFile("/" + path, "binary");
	const resp = await fetch(path);
	const buf = await resp.arrayBuffer();
	await f.write(buf);
	await f.close();
}
// Copy our project files
await pod.createDirectory("/project");
await copy_file(pod, "project/main.js");
await copy_file(pod, "project/package.json");
```

This code copies the project files into the Pod's filesystem.

In this case the files are served alongiside the index.html page, but you can
get them from other sources, or embed them directly as strings.

### Install dependencies

```js
// Install dependencies
await pod.run("npm", ["install"], {
	terminal,
	cwd: "/project",
	echo: true,
});
```

We finally execute some code in the Pod.

This runs `npm install` to fetch the project's dependencies from the internet.

You might want to bundle the `node_modules` directory and the `package-lock.json`
file directly alongside the project files instead.

### Run the application

```js
// Run the server
await pod.run("node", ["main.js"], {
	terminal,
	cwd: "/project",
	echo: true,
});
```

This runs our application.

Once the tcp socket starts listening, the `onPortal()` callback will execute,
and the `hello world` will show up in the iframe.

### Full code listing

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
			import { BrowserPod } from "https://rt.browserpod.io/%BP_LATEST%/browserpod.js";
			// Utility function to copy files from the HTTP server into the Pod's
			// filesystem
			async function copy_file(pod, path) {
				const f = await pod.createFile("/" + path, "binary");
				const resp = await fetch(path);
				const buf = await resp.arrayBuffer();
				await f.write(buf);
				await f.close();
			}

			// Boot the Pod
			const pod = await BrowserPod.boot({ apiKey: "your-api-key" });

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
			await pod.run("npm", ["install"], {
				terminal,
				cwd: "/project",
				echo: true,
			});

			// Run the server
			await pod.run("node", ["main.js"], {
				terminal,
				cwd: "/project",
				echo: true,
			});
		</script>
	</body>
</html>
```

## End result

![The index.html page rendered](/docs/browserpod/tutorials/express.png)

## Source code

[View full source code on GitHub](https://github.com/leaningtech/browserpod-meta/tree/main/examples/expressjs)
