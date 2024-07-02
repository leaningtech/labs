---
title: Browser APIs
description: "`client.h`"
# TODO: terrible page because we are explaining both client.h and clientlib.h
---

You can use browser APIs in [genericjs code](/docs/reference/sections/genericjs) via the `client` namespace.

## `cheerp/clientlib.h`

`clientlib.h` declares browser APIs and can be included with:

```cpp
#include <cheerp/clientlib.h>
```

## `cheerp/client.h`

`client.h` contains helpers like the `SAFE_INLINE` macro and utilities under the `cheerp` namespace.

```cpp
#include <cheerp/client.h>
```

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

`client.h` also provides complex types like [`_Any`, `_Union`, and `_Function`](/docs/reference/browser-apis/complex-types).

## OpenGL ES

OpenGL ES is also supported with [a different header](/docs/reference/browser-apis/gles).
