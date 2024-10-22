---
title: Frequently Asked Questions
---

## Why can't CheerpX find files in my `WebDevice` backend?

We know from experience that the interaction between mount points and `WebDevice` can be confusing for some users. The best solution to identify why a file can't be found is to use the _**Network**_ tab to see the final URLs that CheerpX is trying to access. With this information you should be able to fix the incorrect paths.

### Debugging Path Issues

Use browser's DevTools:

1. Open DevTools (F12 or right-click and "Inspect").
2. Go to "Network" tab.
3. Filter for your application's requests.
4. Look for 404 (Not Found) errors.
5. Check the full URL of these 404 requests to see the exact path CheerpX is trying to access.

## Can I use third-party origins with `WebDevice`?

Yes, `WebDevice` can handle third-party origins as paths, but it's important to consider the implications of Cross-Origin Resource Sharing (CORS) when doing so. To ensure smooth functioning, the server hosting these third-party resources must have the appropriate CORS headers configured. If the CORS settings are not properly arranged, browsers will block these requests, which will lead to files being inaccessible in CheerpX.

## Why can't I execute files directly from a `DataDevice`?

`DataDevice` in CheerpX does not have full support for Linux mode bits, and in particular it lacks the _**executable**_ bit. This means you can read data from it, but you cannot execute files directly from it. To execute files that are in a DataDevice, you need to first copy the files to a filesystem with complete support for mode bits, such as `IDBDevice` (IndexedDB) or Ext2.

## Why can't CheerpX do what v86 does in terms of disk access and networking?

CheerpX's architecture and use case differ significantly from v86, which affects how it handles disk access and networking:

### Disk Access

CheerpX is designed to support large scale applications and complete Operating Systems, to achieve those objectives it needs to handle large disk images (up to 2GB at the time). This means we cannot simply download the entire disk image before starting execution, as v86 might do for its smaller images. Instead, CheerpX uses a chunk-based, on-demand downloading system.

Our cloud disk backend is based on WebSocket and distributed across a global CDN, which should provides low latency disk access to users everywhere in the world. We are aware that some users in mainland China might experience slower disk access at the moment due to local networking constraints.

### Networking

While v86 might use an open proxy to the internet, this approach is not feasible for CheerpX due to its scale of use. An open proxy can pose significant security and abuse risks when used at scale.

Instead, CheerpX supports Tailscale-based networking, which can accommodate many use cases. It's important to note that developers using CheerpX are responsible for implementing appropriate security measures and preventing potential abuse.

## Missing cross-origin isolation

If you encounter the following error message:

`Uncaught CheerpX initialization failed: DataCloneError: DedicatedWorkerGlobalScope.postMessage: The SharedArrayBuffer object cannot be serialized. The Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy HTTP headers can be used to enable this.`

This error occurs because CheerpX relies on SharedArrayBuffer, which requires the site to be cross-origin isolated. To activate cross-origin isolation, ensure your site is served over HTTPS and include the following headers in your responses:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

By adding these headers to your server configuration you will enable cross-origin isolation and CheerpX will be able to start.
