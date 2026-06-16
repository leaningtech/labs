---
title: BrowserPod
description: The BrowserPod class and what a "Pod" is
---

`BrowserPod` is the main class and entry point of the BrowserPod API. An instance of `BrowserPod` is commonly called a **Pod**: a complete, isolated Linux environment running inside the browser tab.

Think of it like a lightweight virtual machine:

- It has its own filesystem
- It can run real programs and shell commands
- It behaves like a real Linux system

**"Isolated"** means each Pod is self-contained:

- Each Pod has its own filesystem
- Processes in one Pod cannot access another
- Everything runs client-side, without server-side execution

## Creating a Pod

Pods are created with the static [`boot`](/docs/reference/BrowserPod/boot) method:

```ts
const pod = await BrowserPod.boot({ apiKey: "..." });
```

`boot` provisions the environment, allocates storage, and returns a ready-to-use Pod. Each call deducts 10 tokens from your account balance.

## Pod lifecycle

A Pod is created with [`BrowserPod.boot`](/docs/reference/BrowserPod/boot) and exists for the lifetime of the browser session. By default, Pods are **ephemeral**. Closing the tab starts a fresh environment.

To persist the filesystem across sessions, pass a `storageKey` to [`boot`](/docs/reference/BrowserPod/boot). Rebooting with the same key resumes the same disk:

```ts
const pod = await BrowserPod.boot({ apiKey: "...", storageKey: "my-project" });
```

## What can you do with a Pod?

### Run programs

Use [`run`](/docs/reference/BrowserPod/run) to execute a program and get back a [Process](/docs/reference/Process):

```ts
const process = await pod.run("node", ["script.js"], { terminal });
```

### Manage the filesystem

Create and read files with [`createFile`](/docs/reference/BrowserPod/createFile) and [`openFile`](/docs/reference/BrowserPod/openFile):

```ts
const file = await pod.createFile("/app/config.json", "text");
await file.write('{ "debug": true }');
await file.close();
```

### Work with terminals

Attach an interactive terminal with [`createDefaultTerminal`](/docs/reference/BrowserPod/createDefaultTerminal):

```ts
const terminal = await pod.createDefaultTerminal(element);
```
