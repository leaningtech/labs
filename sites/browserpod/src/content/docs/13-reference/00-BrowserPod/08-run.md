---
title: run
description: "Run an executable inside a BrowserPod Pod, attach it to a terminal for input and output, and wait for its exit code."
---

```ts
class BrowserPod {
	async run(
		executable: string,
		args: Array<string>,
		opts: {
			terminal: Terminal;
			env?: Array<string>;
			cwd?: string;
			echo?: boolean;
		}
	): Process;
}
```

## Parameters

- **executable (`string`)** - The path of the program to execute.
- **args (`Array<string>`)** - The command line arguments to pass to the program.
- **opts (`object`)** - Initialization options passed as an object.

## Options

- **terminal (`Terminal`)** - The [Terminal] object used by the spawned process for I/O.
- **env (`Array<string>`, _optional_)** - The environment variables to pass to the program, in the form "KEY=value".
- **cwd (`string`, _optional_)** - The current working directory.
- **echo (`boolean`, _optional_)** - Whether to write the command line of the executed process to the terminal.

## Returns

`run` returns a [Process], a thenable object. Awaiting it resolves to the exit code of the process once it exits, so you can check whether it succeeded or failed:

```ts
const exitCode = await pod.run("npm", ["install"], { terminal });
if (exitCode !== 0) {
	console.error(`npm install failed with exit code ${exitCode}`);
}
```

[Terminal]: /docs/reference/Terminal
[Process]: /docs/reference/Process
