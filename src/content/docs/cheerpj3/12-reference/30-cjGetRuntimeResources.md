---
title: cjGetRuntimeResources
description: List resources that were loaded
---

Returns a JavaScript string representing the data that should be passed to [preloadResources]. Once parsed, it is an object containing the filenames that have been loaded from the runtime up to the time this function is called.

See [startup time optimization](/cheerpj3/guides/Startup-time-optimization) for more information.

```ts
function cjGetRuntimeResources(): string;
```

> [!note] Note
> This function is intended for use in the browser console. It is not intended to be called from within your application.

## Parameters

`cjGetRuntimeResources` does not take any parameters.

## Returns

`cjGetRuntimeResources` returns a string representing the files that have been loaded from the runtime.

Parse this string with [JSON.parse] and pass it as [preloadResources] in future page loads.

## Example

In the browser console, type:

```shell
cjGetRuntimeResources();
```

The output would look like this:

```js
'{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}';
```

[preloadResources]: /cheerpj3/reference/cheerpjInit#preloadresources
[JSON.parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
