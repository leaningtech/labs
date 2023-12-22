---
title: CheerpXApp#run
description: Run a command
---

```ts
class CheerpXApp {
	async run(
		fileName: string, // Path to executable
		args: string[],
		options?: {
			env?: string[]; // Environment variables in the form "KEY=VALUE"
			cwd?: string; // Working directory
			uid?: number; // User ID
			gid?: number; // Group ID
		},
	): Promise<number>;
}
```

## Returns

Once the process exits, resolves with its exit code.
