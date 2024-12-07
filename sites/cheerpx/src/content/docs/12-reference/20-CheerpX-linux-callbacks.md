---
title: CheerpX.Linux event callbacks
description: Event Callbacks for CPU and Disk Monitoring
---

The `CheerpX.Linux` instance returned by `create` provides methods to register and unregister callbacks to monitor CPU and disk activity, as well as disk latency.

### `registerCallback`

```ts
registerCallback(eventName: string, callback: (state: string | number) => void): void
```

Registers a callback function for a specific event type.

**Parameters**:

- **eventName**: A string specifying the event type. Can be `"cpuActivity"`, `"diskActivity"`, or `"diskLatency"`.
- **callback**: A function that will be called when the event occurs. It receives a parameter which varies based on the event type:
  - For `"cpuActivity"` and `"diskActivity"`: `state` can be either "ready" (idle, no activity at this time) or "wait" (active, currently in use).
  - For `"diskLatency"`: `state` is a number representing the time in milliseconds between requesting and receiving the last disk block from the backend.

### `unregisterCallback`

```ts
unregisterCallback(eventName: string, callback: (state: string | number) => void): void
```

Unregisters a previously registered callback function for a specific event type.

**Parameters**:

- **eventName**: A string specifying the event type. See the `registerCallback` reference above for the supported event types.
- **callback**: The function to be unregistered.

Example usage:

```js
function hddCallback(state) {
	if (state === "ready") {
		console.log("Disk Activity: Ready");
	} else {
		console.log("Disk Activity: Busy");
	}
}

function cpuCallback(state) {
	if (state === "ready") {
		console.log("CPU Status: Ready");
	} else {
		console.log("CPU Status: Busy");
	}
}

function latencyCallback(latency) {
	console.log(`Last Disk Latency: ${latency} ms`);
}

if (cx) {
	cx.registerCallback("cpuActivity", cpuCallback);
	cx.registerCallback("diskActivity", hddCallback);
	cx.registerCallback("diskLatency", latencyCallback);

	// Simulate CPU, disk activity, and latency logs for testing purposes
	setInterval(() => {
		// Simulate CPU activity
		const state = Math.random() > 0.5 ? "ready" : "busy";
		cpuCallback(state);

		// Simulate disk activity
		const diskState = Math.random() > 0.5 ? "ready" : "busy";
		hddCallback(diskState);

		// Random latency between 0 and 99 ms
		const simulatedLatency = Math.floor(Math.random() * 100);
		latencyCallback(simulatedLatency);
	}, 3000);
}

// Later, if needed:
// cx.unregisterCallback("cpuActivity", cpuCallback);
// cx.unregisterCallback("diskActivity", hddCallback);
// cx.unregisterCallback("diskLatency", latencyCallback);
```

This example demonstrates how to register callbacks for CPU activity, disk activity, and disk latency. The CPU and disk activity callbacks log the current state (either "ready" or "busy") to the console, while the disk latency callback logs the latency of the last downloaded disk block.
Additionally, the simulated events are generated for testing purposes, allowing you to see output for all three types of activity.

### `processCreated` Event

The `processCreated` event is triggered by the **CheerpX engine** whenever a native process is created. This includes actions such as running a command within the WebVM terminal. The event provides a mechanism to track the number of processes created during the session.

**How it works**

Here's how the `processCreated` event is utilized in the code:

1. **Callback Registration:**

During the initialization of the CheerpX environment, the event is registered with the callback `handleProcessCreated`.

```js
cx.registerCallback("processCreated", handleProcessCreated);
```

2. **Callback implementation**

The `handleProcessCreated` function increments a `processCount` variable and triggers a callback if one is set via the processCallback function.

```js
function handleProcessCreated() {
	processCount++;
	if (processCallback) processCallback(processCount);
}
```

The purpose of the `processCreated` event is to maintain an up-to-date count of created processes. This information can be used to monitor system activity.
