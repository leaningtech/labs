---
title: Run an npm project with a live preview
shortTitle: npm project tutorial
description: "Tutorial: copy an npm project into a Pod, install its dependencies with npm, start its server, and preview it on your page and on any device through a Portal."
---

In this tutorial you build a page that runs an npm project in the browser. The page boots a [Pod](/docs/reference/BrowserPod), copies the project into it, installs its dependencies with `npm install`, and starts its server. A [Portal](/docs/understanding-browserpod/portals) gives the server a public URL, which the page shows in an iframe and which you can open on any other device.

## Before you start

- **A BrowserPod Edge key.** Portals are part of [BrowserPod Edge](/docs/understanding-browserpod/api-key) (free tier available). Get a key at https://console.browserpod.io; see [Quickstart](/docs/getting-started/quickstart#1-get-a-free-browserpod-edge-key). Without a key the server still runs, but there is no preview.
- **Node.js and npm** on your machine, to run the page's dev server.

## 1. Create the project

Scaffold the project from the **Web server** template, with your key:

```bash
npm create browserpod-quickstart@latest -- npm-tutorial -t vite-web -k <your-key>
cd npm-tutorial
npm install
npm run dev
```

Open the address the dev server prints, for example [http://localhost:5173/](http://localhost:5173/). The terminal on the page shows `npm install` and then the project's server starting, and the preview loads when the Portal is ready.

## 2. Two npm projects

The project contains two npm projects, one inside the other:

```plaintext
├── .env                  # VITE_BP_APIKEY, your key
├── index.html            # the page
├── package.json          # the page's dependencies: Vite and BrowserPod
├── vite.config.js        # the dev server, with the COOP and COEP headers
├── public
│   └── project           # the project that runs in the Pod
│       ├── main.js
│       └── package.json
└── src
    ├── main.js           # boots the Pod and runs the project
    ├── style.css
    └── utils.js          # copies files into the Pod
```

- **The page** runs on your machine, served by Vite. It boots the Pod.
- **The project in `public/project`** runs inside the Pod. Vite serves it as static files, and the page copies them into the Pod.

## 3. The project that runs in the Pod

The example project is a small web server built with Express, but it stands for any npm project: the steps are the same for yours. Its only dependency is Express:

```json title="public/project/package.json"
{
	"name": "expressjs-tutorial",
	"version": "1.0.0",
	"main": "main.js",
	"license": "MIT",
	"dependencies": {
		"express": "^5.1.0"
	}
}
```

It serves one page on port 3000 (the page's HTML is left out here):

```js title="public/project/main.js"
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send(`<!DOCTYPE html> ... `);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
```

Nothing in it is specific to BrowserPod: the same project runs with Node.js on any machine.

## 4. The page that runs the Pod

### The dev server

`vite.config.js` sets the two headers that make the page [cross-origin isolated](/docs/understanding-browserpod/cross-origin-isolation), which BrowserPod needs:

```js title="vite.config.js"
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

### The page

`index.html` has three elements for the script to fill: `#url` for the Portal's address, the `#portal` iframe for the preview, and `#console` for the terminal:

```html title="index.html"
<div id="url">Waiting for portal...</div>
<div class="preview-container">
	<iframe id="portal"></iframe>
	<pre id="console"></pre>
</div>
<script type="module" src="/src/main.js"></script>
```

### Copying files into the Pod

`copyFile` fetches a file from the page's server and writes it into the Pod, under the folder you give it. `copyFile(pod, "project/main.js", "/home/user")` writes `/home/user/project/main.js`:

```js title="src/utils.js"
export async function copyFile(pod, path, prefix) {
	const normalizedPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
	const f = await pod.createFile(`${normalizedPrefix}/${path}`, "binary");
	const resp = await fetch(path);
	const buf = await resp.arrayBuffer();
	await f.write(buf);
	await f.close();
}
```

See [Write files to the Pod](/docs/guides/write-files-to-pod) for other ways to get files into a Pod.

### Running the project

`src/main.js` does the work, in five steps:

```js title="src/main.js"
import { BrowserPod } from "@leaningtech/browserpod";
import { copyFile } from "./utils";

// 1. Read the key from .env; an empty value counts as no key
const apiKey = import.meta.env.VITE_BP_APIKEY?.trim() || undefined;

// Portals need a key, so without one, explain how to enable the preview
const urlDiv = document.getElementById("url");
if (!apiKey) {
	urlDiv.innerHTML =
		"The preview needs an API key. Add VITE_BP_APIKEY to .env and restart the dev server.";
}

// 2. Boot the Pod: on the Edge network with a key, or on the fetch network
// with opinionatedFetch without one, so that npm install still works
const pod = apiKey
	? await BrowserPod.boot({ apiKey })
	: await BrowserPod.boot({
			network: await BrowserPod.createFetchNetwork({
				fetch: BrowserPod.opinionatedFetch,
			}),
		});

const terminal = await pod.createDefaultTerminal(
	document.querySelector("#console")
);

// 3. When a server in the Pod starts listening, show its Portal
const portalIframe = document.getElementById("portal");
pod.onPortal(({ url, port }) => {
	urlDiv.innerHTML = `Portal available at <a href="${url}">${url}</a> for local server listening on port ${port}`;
	portalIframe.src = url;
});

// 4. Copy the project into the Pod
const homePath = "/home/user";
const projectPath = `${homePath}/project`;
await pod.createDirectory(projectPath);
await copyFile(pod, "project/main.js", homePath);
await copyFile(pod, "project/package.json", homePath);

// 5. Install the dependencies, then start the server
await pod.run("npm", ["install"], {
	echo: true,
	terminal,
	cwd: projectPath,
});
await pod.run("node", ["main.js"], {
	echo: true,
	terminal,
	cwd: projectPath,
});
```

1. **Read the key.** `VITE_BP_APIKEY` comes from `.env`. See [where to store the API key](/docs/understanding-browserpod/api-key#where-to-store-the-api-key).
2. **Boot the Pod.** With a key, [`boot`](/docs/reference/BrowserPod/boot) connects the Pod to BrowserPod Edge. Without one, the Pod uses the browser's `fetch()`, with [`opinionatedFetch`](/docs/understanding-browserpod/networking#using-npm-without-an-api-key) so that npm can reach the registry.
3. **Show the Portal.** [`onPortal`](/docs/reference/BrowserPod/onPortal) calls back when a program in the Pod listens on a port, with a public URL for it. The page shows the URL and loads it in the iframe.
4. **Copy the project** into `/home/user/project`.
5. **Run it.** [`run`](/docs/reference/BrowserPod/run) runs `npm install`, then `node main.js`, in the project's folder, as you would in a terminal. `echo` prints each command in the terminal before it runs.

## 5. See it running

When `npm install` finishes and the server starts, the iframe loads the page the project serves from inside the Pod:

![The tutorial page: the project's page in the preview iframe, beside the terminal](/docs/assets/express.png)

The Portal URL is public: open it on your phone, or send it to someone else, while the page is open.

## Next steps

- [Set up a Portal](/docs/guides/setup-portal) covers Portals in more detail.
- Keep the project between visits by booting with a [`storageKey`](/docs/understanding-browserpod/filesystem).
- See [Networking](/docs/understanding-browserpod/networking) for what the Pod can reach with and without Edge.
