---
title: Overview
description: Quickstarts to easily instantly boot BrowserPod. 
---
This page shows two ways to get started:

1) Use the official quickstart template (fastest)
2) Boot a minimal BrowserPod instance by hand (smallest possible example)

## Option A: Quickstart template

### 1. Create a project

```bash
npm create browserpod-quickstart
```

When prompted, choose a project name and paste your API key (this is optional, but recommended).

### 2. Install dependencies and run

```bash
cd <your-project-name>
npm install
npm run dev
```

Open `http://localhost:5173/`. You should see a page that boots BrowserPod and runs a server in the browser.

### 3. Add your API key

Whether or not your provided an API key during installation, a `.env` file will be created at your project root:

```txt
VITE_BP_APIKEY=
```

If you provided your API key during installation, it will already be copied into this file.

If not, paste your API key into the `VITE_BP_APIKEY` field before running the project. An API key is required for BrowserPod to function.

## Option B: Minimal manual setup

This shows the smallest working flow: boot a pod, wait for Wasm init, create a terminal, run a program, and open a portal.

### 1. Install

```bash
npm install @leaningtech/browserpod
```

### 2. Minimal example

```js
import { BrowserPod } from "@leaningtech/browserpod";

const pod = await BrowserPod.boot({
  apiKey: import.meta.env.VITE_BP_APIKEY,
});

// Wait for the Wasm runtime to finish initializing
await new Promise((resolve) => setTimeout(resolve, 500));

const terminal = await pod.createDefaultTerminal(
  document.querySelector("#console")
);

pod.onPortal(({ url, port }) => {
  console.log(`Portal URL: ${url} (local port ${port})`);
  document.querySelector("#preview").src = url;
});

await pod.createDirectory("/project");

// Copy your files into /project, then run:
await pod.run("node", ["server.js"], {
  terminal,
  cwd: "/project",
  echo: true,
});
```

## Next steps

- [Environment setup](/docs/getting-started/setup)
- [Understanding BrowserPod](/docs/core-concepts/runtime-model)
- [Tutorial: Express.js server](/docs/tutorials/expressjs)
- [API reference](/docs/reference/browserpod)
