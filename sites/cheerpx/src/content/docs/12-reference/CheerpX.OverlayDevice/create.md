---
title: create
description: Virtual filesystems and how to use them
---

```ts
namespace CheerpX {
  class OverlayDevice {
    static async create(baseDevice: Device, overlayDevice: Device): Promise<OverlayDevice>;
  }
}
```

## Parameters

- **baseDevice (`Device`)** - The underlying device (e.g., `HttpBytesDevice`, `IDBDevice`) that serves as the base layer for the filesystem.

- **overlayDevice (`Device`)** - The writable layer that will overlay the base device, enabling persistent changes.
