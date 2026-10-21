---
title: Process
description: A handle to a process running inside a Pod
---

A `Process` is a handle to a process running inside a [Pod](/docs/reference/BrowserPod). It is returned by [`run`](/docs/reference/BrowserPod/run).

`Process` is a thenable object: awaiting it resolves to the exit code of the process once it exits. If the process cannot be started or is killed by a signal, awaiting it throws an error instead.

```ts
class Process {}
```

## Creating a Process

```ts
const exitCode = await pod.run("node", ["script.js"], { terminal });
```
