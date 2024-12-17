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

### Disk access

CheerpX is designed to support large scale applications and complete Operating Systems, to achieve those objectives it needs to handle large disk images (up to 2GB at the time). This means we cannot simply download the entire disk image before starting execution, as v86 might do for its smaller images. Instead, CheerpX uses a chunk-based, on-demand downloading system.

Our cloud disk backend is based on WebSocket and distributed across a global CDN, which should provides low latency disk access to users everywhere in the world. We are aware that some users in mainland China might experience slower disk access at the moment due to local networking constraints.

### Networking

While v86 might use an open proxy to the internet, this approach is not feasible for CheerpX due to its scale of use. An open proxy can pose significant security and abuse risks when used at scale.

Instead, CheerpX supports Tailscale-based networking, which can accommodate many use cases. It's important to note that developers using CheerpX are responsible for implementing appropriate security measures and preventing potential abuse.

## Missing cross-origin isolation

If you encounter the following error message:

`Uncaught CheerpX initialization failed: DataCloneError: DedicatedWorkerGlobalScope.postMessage: The SharedArrayBuffer object cannot be serialized. The Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy HTTP headers can be used to enable this.`

This error occurs because CheerpX relies on [SharedArrayBuffer], which requires the site to be [cross-origin isolated]. To activate cross-origin isolation, ensure your site is served over HTTPS and include the following headers in your responses:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

By adding these headers to your server configuration you will enable cross-origin isolation and CheerpX will be able to start.

For more information on server configurations, please see our [server setup guide].

## Why can't I use the `file://` protocol?

CheerpX requires certain browser capabilities that are not available when accessing files directly using the `file://` protocol. Here’s an explanation of the issue and the recommended solution.

### Security restrictions and Cross-Origin Headers

Modern browsers enforce strict security policies to protect users from potentially harmful actions. Accessing files through the `file://` protocol poses a security risk, as it may allow untrusted HTML files to interact with local resources and cause data breaches.

Additionally, [SharedArrayBuffer] requires cross-origin isolation to function properly, which cannot be established when serving files with the `file://` protocol. This protocol does not support setting the required HTTP headers: `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`.

### Recommended solution: local web server requirement

To properly utilize CheerpX, you must run a local web server. This allows you to access your HTML files with a URL that starts with `http://` or `https://`, for example `http://localhost:8080/`. Using a web server ensures that all necessary HTTP headers for cross-origin isolation can be correctly applied.

For more information on how to setup a HTTP server, please see our [server setup guide].

## When do I need an exit node for WebVM networking?

You **do** need to create an exit node if you want your WebVM to access the public internet. An exit node routes traffic from your WebVM to the internet, making it possible to connect to online services. This is particularly important in scenarios where WebVM needs to interact with resources outside your Tailscale network.

You do **not** need to create an exit node for WebVM if your goal is to access other devices within your Tailscale network, including other WebVM instances and your local development machine. Tailscale takes care of routing and connecting your WebVM to other devices on the Tailscale network seamlessly.

For detailed instructions on WebVM networking and setting up an exit node, check out our [Networking Guide](/docs/guides/Networking#exit-node).

[server setup guide]: /docs/guides/nginx
[SharedArrayBuffer]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
[cross-origin isolated]: https://web.dev/articles/why-coop-coep
