---
title: Resource preloading
description: Improves application startup time
---

CheerpJ runs Java applications and applets in the browser, with no local Java installation. To do this, it downloads parts of the Java runtime, such as the OpenJDK class library, while the application runs. By default, these **runtime resources** are **loaded on demand**, when the application first needs them.

Loading on demand keeps the download small, since only the parts of the runtime the application uses are fetched, and the browser **caches** them for later visits. The trade-off is that CheerpJ cannot know in advance which resources a particular application needs, so on a first visit it fetches them **one after another** as the application reaches them.

To reduce startup time in production, CheerpJ can **preload** the resources your application uses, so that they download **in parallel** as the application starts.

**What resource preloading does**

- **Without preloading:** CheerpJ fetches runtime resources one at a time, as they become necessary.
- **With preloading:** CheerpJ starts downloading a predefined set of resources immediately, in parallel, so the application starts faster.

**When to use it**

- You are deploying an application to production and want a **faster first load**
- Your users often start with an empty cache (first visit, cleared cache, new device)
- You want to avoid pauses caused by fetching resources one at a time

## Overview of the workflow

1. Record which runtime resources your application uses, with [`cjGetRuntimeResources`](/docs/reference/cjGetRuntimeResources)
2. Pass that list to [`cheerpjInit`](/docs/reference/cheerpjInit) with the [`preloadResources`](/docs/reference/cheerpjInit#preloadresources) option

### Step 1: Profile used runtime resources

1. Run your application with CheerpJ, and use the parts of it that your users need at startup.
2. Open the browser's developer tools console (often `Ctrl+Shift+I`).
3. Run:

```js
cjGetRuntimeResources();
```

**The output looks like this:**

```js
{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}
```

**If the console does not show the full output, use:**

```js
document.write(cjGetRuntimeResources());
```

`cjGetRuntimeResources` returns a string, so the console may show the output in quotes (`"`). Copy the output without the quotes, or parse the string with [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).

### Step 2: Enable preloading in your integration

Add the [`preloadResources`](/docs/reference/cheerpjInit#preloadresources) option to your [`cheerpjInit`](/docs/reference/cheerpjInit) call, with the object from step 1.

Example:

```js
cheerpjInit({
  preloadResources: {
    "/lts/file1.jar": [int, int, ...],
    "/lts/file2.jar": [int, int, ...]
  }
});
```

Profiling the resources with [`cjGetRuntimeResources`](/docs/reference/cjGetRuntimeResources) and passing the result to [`preloadResources`](/docs/reference/cheerpjInit#preloadresources) happen in separate sessions. First, profile the application in one session to generate the list of resources. Then pass this list to `cheerpjInit` in your page, so that later sessions preload it.

To show the progress of the preload, for example in a loading bar, add the [`preloadProgress`](/docs/reference/cheerpjInit#preloadprogress) callback.

## What changes after enabling preloading

With `preloadResources`, CheerpJ downloads several resources **in parallel** while the program runs, which can **reduce startup time considerably**, especially on a first visit.
