---
title: Resource preloading
description: Improves application startup time
---

CheerpJ runs Java applications and applets directly in the browser (no local Java install needed). To do this, CheerpJ loads **runtime components** (JavaScript modules) while the app executes. By default, these modules are **loaded on demand**, only when the app needs them.

This “load as needed” approach keeps the initial download small (typically **10–20MB** for many apps) and everything is **cached by the browser** for faster repeat visits. The tradeoff is that CheerpJ can’t know ahead of time which modules your specific app will need, so it loads them **one after another** at runtime.

To reduce startup time in production, CheerpJ lets you **preload** the modules your app commonly uses, so they can download **in parallel** as the app starts.

**What resource preloading does**

- **Without preloading:** CheerpJ fetches runtime resources sequentially as they become necessary.
- **With preloading:** CheerpJ starts downloading a pre-defined set of resources immediately, allowing parallel downloads and faster startup.

**When to use it**

- You’re deploying an app to production and want **faster first load**
- Your users often hit a cold cache (first visit, cleared cache, new device)
- You want to avoid runtime “stalls” caused by sequential resource fetching

## Overview of the workflow

1. Profile which runtime resources your app actually uses
2. Pass those resources to `cheerpjInit` via `preloadResources`

### Step 1: Profile used runtime resources

1. Run your application normally with CheerpJ.
2. Once the app has loaded, open your browser’s JavaScript console (often `Ctrl+Shift+I`).
3. Run:

```js
cjGetRuntimeResources();
```

**The output will look like:**

```js
{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}
```

**If you can’t see the full output in the console, use:**

```js
document.write(cjGetRuntimeResources());
```

> The console may wrap the output in quotes (`"`). If it does, ignore the quotes.
> See [here](/docs/reference/cjGetRuntimeResources) for more information.

### Step 2: Enable preloading in your integration

Update your `cheerpjInit` call to include the `preloadResources` option.

Example:

```js
cheerpjInit({
  preloadResources: {
    "/lts/file1.jar": [int, int, ...],
    "/lts/file2.jar": [int, int, ...]
  }
});
```

> This must be done in two steps,so the resources are loaded in a separate session from the full workflow.
> See [here](/docs/reference/cheerpjInit#preloadresources) for more information.

## What changes after enabling preloading

When `preloadResources` is enabled, CheerpJ can download multiple resources **in parallel** with the program’s execution, which can **significantly reduce startup time**, especially on first load.
