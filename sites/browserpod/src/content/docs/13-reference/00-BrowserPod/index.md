---
title: BrowserPod
description: "The BrowserPod class is the entry point to the API. An instance, called a Pod, is a microVM running in the browser tab."
---

`BrowserPod` is the main class and entry point of the BrowserPod API. An instance of `BrowserPod` is commonly called a **Pod**: a microVM running inside the browser tab. A Pod boots a Linux-like kernel with its own filesystem, processes and network, and runs Linux programs such as Node.js, git, bash and Rust binaries.

**"Isolated"** means each Pod is self-contained:

- Each Pod has its own filesystem
- Processes in one Pod cannot access another
- Everything runs client-side, without server-side execution

## Creating a Pod

Pods are created with the static [`boot`](/docs/reference/BrowserPod/boot) method. With an API key, the Pod boots on the Edge network:

```ts
const pod = await BrowserPod.boot({ apiKey: "..." });
```

Without one, it boots on the fetch network:

```ts
const pod = await BrowserPod.boot();
```

`boot` provisions the environment, allocates storage, and returns a ready-to-use Pod. Booting with an API key (on the Edge network) is charged per connected hour; booting without an API key (on the fetch network) is free. See [Networking](/docs/understanding-browserpod/networking) for details.

## Pod lifecycle

A Pod is created with [`BrowserPod.boot`](/docs/reference/BrowserPod/boot) and exists for the lifetime of the browser session. By default, Pods are **ephemeral**. Closing the tab starts a fresh environment.

To persist the filesystem across sessions, pass a `storageKey` to [`boot`](/docs/reference/BrowserPod/boot). Rebooting with the same key resumes the same disk:

```ts
const pod = await BrowserPod.boot({ apiKey: "...", storageKey: "my-project" });
```

## What can you do with a Pod?

### Run programs

Use [`run`](/docs/reference/BrowserPod/run) to execute a program. It returns a [Process](/docs/reference/Process) that resolves to the exit code when awaited:

```ts
const exitCode = await pod.run("node", ["script.js"], { terminal });
```

### Manage the filesystem

Create and read files with [`createFile`](/docs/reference/BrowserPod/createFile) and [`openFile`](/docs/reference/BrowserPod/openFile):

```ts
const file = await pod.createFile("/app/config.json", "utf-8");
await file.write('{ "debug": true }');
await file.close();
```

### Work with terminals

Attach an interactive terminal with [`createDefaultTerminal`](/docs/reference/BrowserPod/createDefaultTerminal):

```ts
const terminal = await pod.createDefaultTerminal(element);
```
