---
title: Complex types
description: "`_Any`, `_Union`, `_Function`"
---

<!-- ![Clientlib fancy types](./cheerp-typescript-fancy-types.png) -->

#### The `_Any` type

This is a pretty simple improvement. Not all client types are objects.
Primitives, such as numbers and booleans, do not inherit from `Object`. It is
sometimes useful to say that a value can have _any_ type. What do we call the
type for such a value? TypeScript calls it `any`, we call it `_Any`.

#### The `_Union` type

`_Union` is a template type that can hold a value of any of the types listed in
its template arguments. Continuing with the TypeScript analogies,
`_Union<T...>` is similar to `T | ...` in TypeScript. For example, the third
argument to the `addEventListener` function can be a boolean, or an object of
type `AddEventListenerOptions`. To specify this, the function signature uses
the type `const _Union<bool, AddEventListenerOptions*>&`.

Union types solve another problem that might not be immediately obvious. To see
why, first let's discuss the alternative.

`Uint8Array` has a constructor that takes either an `ArrayBuffer*`, a
`SharedArrayBuffer*` or an `ArrayLike<double>*`. Instead of using a union type
in the constructor, we could instead generate 3 separate overloads.

```cpp
Uint8Array(ArrayBuffer* array);
Uint8Array(SharedArrayBuffer* array);
Uint8Array(ArrayLike<double>* array);
```

`Uint8Array` also has a `get_buffer` method. This method returns an
`ArrayBuffer*` or a `SharedArrayBuffer*`. We cannot use the same overload trick
with return types, so it must still return a union.

```cpp
_Union<ArrayBuffer*, SharedArrayBuffer*>* get_buffer();
```

Ideally, we should be able to directly pass the result of `get_buffer` to the
constructor of `Uint8Array`. This does not work with the overloads because each
individual signature is not compatible with the union type returned by
`get_buffer`.

```cpp
new Uint8Array(array->get_buffer()); // error
new Uint8Array(array->get_buffer()->cast()); // error: ambiguous
new Uint8Array(array->get_buffer()->cast<ArrayBuffer*>()); // ok
```

By instead using a const reference union type for the constructor, we _can_
directly pass the result of `get_buffer` to the constructor without the need
for any casts.

```cpp
Uint8Array(const _Union<ArrayBuffer*, SharedArrayBuffer*, ArrayLike<double>*>& array);
```

#### The `_Function` type

`_Function` is a type safe first-class function type that is used for passing
functions to higher order functions. The template argument to `_Function` is a
C-style function type that specifies the return value and arguments of the
function. `_Function` types can be constructed from raw function pointers and
from C++11 lambdas.

#### Type conversions

You will often find the `_Any`, `_Union`, and `_Function` types passed by const
reference. Passing by const reference allows these types to be implicitly
constructed from other compatible types. The rules for these conversions are
specified by the `cheerp::CanCast` helper template, which mostly mimics the
rules of TypeScript.

`_Any` can be constructed from any other type. `_Union` can be constructed from
any type that can be converted to any of the types in the union. `_Function`
can be constructed from other functions with a _covariant_ return type and an
equal or smaller number of _contravariant_ arguments.
