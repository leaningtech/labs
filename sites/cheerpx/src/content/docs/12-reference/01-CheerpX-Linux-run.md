---
title: CheerpX.Linux.run
description: Run a command
---

```ts
namespace CheerpX {
	class Linux {
		async run(
			fileName: string,
			args: string[],
			options?: {
				env?: string[]; // Environment variables in the form "KEY=VALUE"
				cwd?: string; // Current working directory
				uid?: number; // User ID
				gid?: number; // Group ID
			}
		): Promise<{ status: number }>;
	}
}
```

## Parameters

- **fileName (`string`)** - The path to the executable file.
- **args (`string[]`)** - Arguments to pass to the executable.
- **options (`object`, _optional_)**:
  - **env (`string[]`)**: Environment variables for the process.
  - **cwd (`string`)**: The working directory from which the command will be run.
  - **uid (`number`)**: User ID under which the command will be executed.
  - **gid (`number`)**: Group ID under which the command will be executed.

## Returns

`CheerpX.Linux.run` returns a [Promise] which resolves when the process terminates. The returned object contains the exit status.

## Example

Let us try running a bash script:

```js
const result = await cx.run("/bin/bash", [
	"-c",
	"for i in {1..5}; do echo $i; done"
]);
console.log("Bash script exit status:", result.status);
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
