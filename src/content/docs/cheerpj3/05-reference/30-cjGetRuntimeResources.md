---
title: cjGetRuntimeResources
---

Returns a JavaScript string representing the data that should be passed to [preloadResources](/cheerpj3/reference/cheerpjInit#preloadresources). Once parsed, it is an object containing the filenames that have been loaded from the runtime up to the time this function is called.

```ts
function cjGetRuntimeResources(): string;
```

## Parameters

- No parameters

## Returns

- **`string`** - string representing the files that have been loaded from the runtime.

## Example

On the browser console type:

```shell
cjGetRuntimeResources();
```

The output would look like this:

```js
'{"/lts/file1.jar":[int, int, ...], "/lts/file2.jar":[int,int, ...]}';
```
