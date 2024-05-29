---
title: Browser APIs
description: "`client.h`"
# TODO: terrible page because we are explaining both client.h and clientlib.h
---

You can use browser APIs in [genericjs code](/cheerp/reference/sections/genericjs) via the `client` namespace.

## `cheerp/clientlib.h`

Browser APIs are provided by `clientlib.h`, which can be included with:

```cpp
#include <cheerp/clientlib.h>
```

## `cheerp/client.h`

> [!warning] Cheerp nightly only
> This header is currently only available on Cheerp nightly. Use `clientlib.h` on stable.

Browser APIs are provided by `client.h`, which can be included with:

```cpp
#include <cheerp/client.h>
```

To migrate from `clientlib.h` to `client.h`, see [the migration guide](/cheerp/guides/clientlib-migration).

### Promises and `cheerp/coroutine.h`

Promises can be awaited using coroutines.

For example:

```cpp
#include <cheerp/coroutine.h>
#include <cheerp/client.h>

using namespace client;

[[cheerp::genericjs]]
[[cheerp::jsexport]]
Promise<String*>* randomUUID() {
  Response* response = co_await *fetch("https://httpbin.org/uuid");
  Object* json = (co_await *response->Body::json())->cast();
  co_return (*json)["uuid"]->cast();
}
```

Any coroutine can be wrapped into a Promise using the following snippet:

```cpp
Promise<Object*>* wrapper() {
  co_return co_await coroutine();
}
```

### Complex types

`client.h` also provides complex types like [`_Any`, `_Union`, and `_Function`](/cheerp/reference/browser-apis/complex-types).

## OpenGL ES

OpenGL ES is also supported with [a different header](/cheerp/reference/browser-apis/gles).
