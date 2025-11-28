---
title: Quickstart
description: Getting started with BrowserPod
---

## What BrowserPod Does

**BrowserPod is a technology for running node.js environments entirely client-side.**

Upon completing the steps below, you'll be able to run a basic node.js script right within your web browser!

> [!note] Prerequisites
> This quickstart assumes you already have a web page or project where you can add scripts. If you're starting from scratch or want a more complete example with server setup and hosting, see the [basic NPM project tutorial].

## 1. Register a free account

In order to use BrowserPod, you need to obtain an API key.

You can register at https://console.browserpod.io using your GitHub account, and
create a new API key.

## 2. Include BrowserPod on your page

No installation is needed. Simply import BrowserPod by adding the following import to your module script:

```js
import { BrowserPod } from "https://rt.browserpod.io/%BP_LATEST%/browserpod.js";
```

All BrowserPod builds are immutable so you can trust that, if your application works today, it is going to work identically forever.

You can also get BrowserPod from NPM as the `@leaningtech/browserpod` package.

## 3. Create a Pod instance

To start using BrowserPod, create an instance by calling the [`BrowserPod.boot`](/docs/reference/BrowserPod/boot) method.

You will need to pass the API key that you created earlier as an argument:

```js
const pod = await BrowserPod.boot({ apiKey: "your-key" });
```

## 4. Initialize a terminal

In order to see the output of our program, we need to set up a terminal.

First, add a [`<pre>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/pre) HTML element somewhere in the page. This element preserves whitespace and displays text in a monospace font, making it ideal for terminal output:

```html
<pre id="console" style="height: 100%;"></pre>
```

Then, use it to initialize the terminal:

```js
const terminalElem = document.getElementById("console");
const terminal = await pod.createDefaultTerminal(terminalElem);
```

## 5. Add your script to the Pod's filesystem

The pod has its own virtual filesystem. You can add files to it with the [`BrowserPod.createFile`](/docs/reference/BrowserPod/createFile) method:

```js
const script = `
const fs = require("fs");
console.log("hello from node", process.version);
console.log("my code is:");
console.log(fs.readFileSync(__filename, "utf8"));
`;
const scriptFile = await pod.createFile("/script.js", "utf-8");
await scriptFile.write(script);
await scriptFile.close();
```

## 6. Run the script

We can finally run our script:

```js
await pod.run("/script.js", [], { echo: true, terminal: terminal });
```

You should see the following output in your terminal element:

```
> /script.js
hello from node v22.15.0
my code is:

const fs = require("fs");
console.log("hello from node", process.version);
console.log("my code is:");
console.log(fs.readFileSync(__filename, "utf8"));
```

## Complete code

```html
<!doctype html>
<html lang="en" style="height: 100%;">
	<head>
		<meta charset="utf-8" />
		<title>BrowserPod Getting Started</title>
		<script type="module">
			import { BrowserPod } from "https://rt.browserpod.io/%BP_LATEST%/browserpod.js";

			// Boot our pod
			const pod = await BrowserPod.boot({ apiKey: "your-key" });

			// Set up terminal output on a `pre` HTML element
			const terminalElem = document.getElementById("console");
			const terminal = await pod.createDefaultTerminal(terminalElem);

			// Define our simple script content
			const script = `
const fs = require("fs");
console.log("hello from node", process.version);
console.log("my code is:");
console.log(fs.readFileSync(__filename, "utf8"));
`;
			// Write the script into the pod's filesystem
			const scriptFile = await pod.createFile("/script.js", "utf-8");
			await scriptFile.write(script);
			await scriptFile.close();

			// Run the script
			await pod.run("/script.js", [], { echo: true, terminal: terminal });
		</script>
	</head>
	<body style="height: 100%; background: black;">
		<pre id="console" style="height: 100%;"></pre>
	</body>
</html>
```

## Enable cross-origin isolation

BrowserPod requires [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). For security reasons, browsers only allow `SharedArrayBuffer` on pages that are [cross-origin isolated](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated).

To enable cross-origin isolation, your server must set the following HTTP headers:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

_You can use HTTP when serving from `localhost`, but make sure to serve over HTTPS when deploying._

For more detailed instructions on how to configure headers in Nginx, check our [Basic server setup guide].

> [!warning] Cross-origin isolation may break existing site functionality
> Cross-origin isolation is a security feature that might impact your site in unexpected ways. For example, if you're embedding third-party iframes or opening cross-origin popup windows, you may need to make changes to your site to make them work. Test carefully!

# Next steps

- **Step-by-step tutorial:** For a complete walkthrough including project setup, server configuration, and working with NPM dependencies, see the [basic NPM project tutorial].
- **Live demo:** For an interactive example with a file editor, NPM dependencies, and hot reloading, try our [Vite+SvelteKit demo].
- **API reference:** Learn about all available methods in the [API reference].

---

[basic NPM project tutorial]: /docs/tutorials/expressjs
[Basic server setup guide]: /docs/guides/nginx
[Vite+SvelteKit demo]: https://vitedemo.browserpod.io
[API reference]: /docs/reference

## Have Questions?

We're here to help! If you have any questions or concerns, feel free to explore our [guides](/docs/guides) or [reference](/docs/reference) section or check out our [frequently asked questions](/docs/faq). You can also connect with our supportive community on [Discord](https://discord.com/invite/yzZJzpaxXT), and reach out whenever you’d like!
