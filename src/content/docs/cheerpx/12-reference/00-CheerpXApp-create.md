---
title: CheerpXApp.create
description: Create a CheerpX application instance
---

```ts
class CheerpXApp {
	static async create(options?: {
		devices?: DeviceConfiguration[];
		mounts?: MountPointConfiguration[];
		networkInterface?: NetworkInterface;
		activityInterface?: ActivityInterface;
		bridgeURL?: string;
	}): Promise<CheerpXApp>;
}

interface DeviceConfiguration {
	name: string;
	type: "block" | "bytes" | "split";
	url: string;
}

interface MountPointConfiguration {
	name: string;
	dev: string;
	path: string; // First mount must be "/" (root)
}

interface NetworkInterface {
	authKey?: string;
	controlUrl?: string;
	loginUrlCb?: (url: string) => void;
	stateUpdateCb?: (state: number) => void;
	netmapUpdateCb?: (map: any) => void;
}

interface ActivityInterface {
	cpu?: (state: "ready" | "wait") => void;
	dev?: (state: "ready" | "wait") => void;
}
```
