---
title: Svelte setup
description: Setting up Svelte app
---

This tutorial will explain how to create a application with Svelte that works together with CheerpX.

## Install Svelte

First create a new Svelte app by running:

```
npm create svelte@latest my-app
```

1. Select the Skeleton Project option.
2. Enable Typescript if needed.
3. There are no additional options required for this tutorial.

Next, navigate to your project directory and install the dependencies:

```
cd my-app
npm install
npm run dev
```

At this point, the development server will run from another terminal in the background.

We're able to test the development server by visiting: http://localhost:5173/

## Install Cheerpx

Next, let's install CheerpX.

This [link] will direct you to the installation page of CheerpX.

For this to work all top level imports used by the CheerpX NPM module need to be enabled.

We'll also need to enable Cross origin isolation. It's required since CheerpX uses SharedArrayBuffer.

```vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const viteServerConfig = () => ({
    name: 'add-headers',
    configureServer: (server) => {
        server.middlewares.use((req, res, next) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            next();
        });
    }
});

export default defineConfig({
  optimizeDeps:{
    esbuildOptions: {
      target: "es2022",
    }
  },
        plugins: [sveltekit(), viteServerConfig()]
});
```

Add src/routes/+page.ts and disable [SSR]. CheerpX code needs to run on the side:

```src/routes/+page.ts
export const ssr = false;
```

## Script

Add the following code to src/routes/+page.svelte to run bash using CheerpX. for a more detailed explanation click the following [instructions].

```js
<style>
:global(html)
{
        height: 100%;
}
:global(body)
{
        height: 100%;
        margin: 0;
}
#console
{
        height: 100%;
        margin: 0;
}
</style>
<pre id="console"></pre>
<script lang="ts">
        import * as CheerpX from '@leaningtech/cheerpx';
        async function runBash()
        {
                const cloudDevice:CheerpX.CloudDevice = await CheerpX.CloudDevice.create("wss://disks.webvm.io/debian_large_20230522_5044875331.ext2");
                const idbDevice:CheerpX.IDBDevice = await CheerpX.IDBDevice.create("block1");
                const overlayDevice:CheerpX.OverlayDevice = await CheerpX.OverlayDevice.create(cloudDevice, idbDevice);
                const cx:CheerpX.Linux = await CheerpX.Linux.create({mounts:[{ type: "ext2", path: "/", dev: overlayDevice }]});
                cx.setConsole(document.getElementById("console"));
                await cx.run("/bin/bash", ["--login"], {
                          env: [
                            "HOME=/home/user",
                            "USER=user",
                            "SHELL=/bin/bash",
                            "EDITOR=vim",
                            "LANG=en_US.UTF-8",
                            "LC_ALL=C",
                          ],
                          cwd: "/home/user",
                          uid: 1000,
                          gid: 1000,
                        });
        }
        runBash();
</script>
```

[link]: https://github.com/leaningtech/labs/blob/main/sites/cheerp/src/content/docs/10-getting-started/01-installation.md
[SSR]: https://www.heavy.ai/technical-glossary/server-side-rendering
[instructions]: https://github.com/leaningtech/labs/blob/main/sites/cheerpx/src/content/docs/10-getting-started/index.md
