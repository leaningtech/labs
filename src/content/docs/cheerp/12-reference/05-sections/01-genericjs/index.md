---
title: genericjs
description: The JavaScript section
---

Function compiled into the genericjs section will be output as JavaScript.

To place functions in the genericjs section, you can:

- Tag individual functions with the `[[cheerp::genericjs]]` attribute.
- Use `-target cheerp` to default to genericjs for all functions.

### Restrictions

- Cannot do type unsafe things
  - Converting a pointer to an integer then using it is undefined behaviour
  - Cannot convert pointers between eachother. For example, you can't read `int*` as `float*` - this will give garbage. Instead, use a union of an int and a float.
