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
  - For `"cpuActivity"` and `"diskActivity"`: `state` can be either "ready" (active) or "wait" (idle).
  - For `"diskLatency"`: `state` is a number representing the time in milliseconds between requesting and receiving the last disk block.

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
	var h = document.getElementById("hddactivity");
	if (state == "ready") h.textContent = "\u{1F7E2}";
	else h.textContent = "\u{1F7E0}";
}

function cpuCallback(state) {
	var h = document.getElementById("cpuactivity");
	if (state == "ready") h.textContent = "\u{1F7E2}";
	else h.textContent = "\u{1F7E0}";
}

function latencyCallback(latency) {
	console.log(`Last disk block download latency: ${latency}ms`);
}

const cx = await CheerpX.Linux.create(/* options */);

cx.registerCallback("cpuActivity", cpuCallback);
cx.registerCallback("diskActivity", hddCallback);
cx.registerCallback("diskLatency", latencyCallback);

// Later, if needed:
// cx.unregisterCallback("cpuActivity", cpuCallback);
// cx.unregisterCallback("diskActivity", hddCallback);
// cx.unregisterCallback("diskLatency", latencyCallback);
```

This example demonstrates how to register callbacks for CPU activity, disk activity, and disk latency. The CPU and disk activity callbacks update UI elements based on the activity state, while the disk latency callback logs the latency of the last downloaded disk block.

> [!note] Note
> The `diskLatency` event works for any type of network block device and provides real-time information about the latency of disk block downloads.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
