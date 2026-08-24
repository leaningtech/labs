---
title: Process
description: A handle to a process that ran inside a Pod
---

A `Process` is an opaque handle to a program that ran inside a [Pod](/docs/reference/BrowserPod). It is returned by [`run`](/docs/reference/BrowserPod/run) once the process has exited.

```ts
class Process {}
```

## Creating a Process

```ts
const process = await pod.run("node", ["script.js"], { terminal });
```

The [Promise] resolves to a `Process` when the program exits.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
