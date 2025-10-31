---
title: run
description: Run a program inside the Pod
---

```ts
class BrowserPod {
	async run(
		executable: string,
		args: Array<string>,
		opts?: { env?: Array<string>; cwd?: string }
	): Promise<Process>;
}
```

## Parameters

- **executable (`string`)** - The path of the program to execute

* **args (`Array<string>`)** - The command line arguments to pass to the program.
* **opts (`object`, _optional_)** - Initialization options passed as an object

## Options

- **env (`Array<string>`, _optional_)** - The environment variables to pass to the program, in the form "KEY=value".
- **cwd (`string`, _optional_)** - The current working directory.

## Returns

`run` returns a [Promise] which is resolved when the command finishes running.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
