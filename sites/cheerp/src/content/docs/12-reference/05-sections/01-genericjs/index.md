---
title: genericjs
description: The JavaScript section
---

Function compiled into the genericjs section will be output as JavaScript.

To place functions in the genericjs section, you can:

- Tag individual functions with the `[[cheerp::genericjs]]` attribute.
- Use `-target cheerp` to default to genericjs for all functions.

## Restrictions

In genericjs, there are some restrictions due to [the memory model](/docs/reference/sections/genericjs/memory-model).

### No type punning

In genericjs, you cannot perform type punning (for example, using `memcpy` or `std::bit_cast`).

<details>
<summary>Example</summary>
The following code will not work when compiled to genericjs.

```cpp {34}
#include <cheerp/client.h>
#include <iostream>
#include <bit>
#include <cstdint>

[[cheerp::genericjs]]
int main() {
  float f = 1.5f;
  auto bits = std::bit_cast<std::uint32_t>(f);
  std::cout << "Bit pattern of " << f << " is: " << std::hex << bits << std::endl;
  return 0;
}
```

<details>
