---
title: run
description: Executes a command within the CheerpX Linux environment.
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

## Options

- **env (`string[]`)**: Environment variables for the process.
- **cwd (`string`)**: The working directory from which the command will be run.
- **uid (`number`)**: User ID under which the command will be executed.
- **gid (`number`)**: Group ID under which the command will be executed.

## Returns

`CheerpX.Linux.run` returns a [Promise] which resolves when the process terminates. The returned object contains the exit status.

### Examples

**1. Run a bash script**

Run a script that prints numbers from 1 to 5:

```js
const result = await cx.run("/bin/bash", [
	"-c",
	"for i in {1..5}; do echo $i; done",
]);
console.log("Bash script exit status:", result.status);
```

**2. Run a shell command with custom environment**

Execute a shell session with specified environment variables, a working directory, and specific user/group IDs:

```js
await cx.run("/bin/bash", ["--login"], {
	env: [
		"HOME=/home/user", // User's home directory
		"USER=user", // Username
		"SHELL=/bin/bash", // Default shell
		"EDITOR=vim", // Default editor
		"LANG=en_US.UTF-8", // Language setting
		"LC_ALL=C", // Locale
	],
	cwd: "/home/user", // Set working directory
	uid: 1000, // Set user ID
	gid: 1000, // Set group ID
});
```

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
