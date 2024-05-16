# Cheerp documentation

Hello! It looks like you're interested in contributing to the Cheerp documentation. That's awesome.

## User stories

We tend to think of 4 types of people who want to use Cheerp. These are:

1. **C++ application developers**: I have an existing C++ application I want to port to the web
1. **C++ library authors**: I have an existing C++ library I want to make available to JavaScript developers
1. **JavaScript developers**: I have an existing JavaScript/TypeScript codebase and I want to add a little C++ to it
1. **Noobs**: I don't know how to program but I want to learn how to make webapps with C++

The current documentation focuses on (1). We are looking to allow (2) as well.

### C++ library authors

We want quickstarts for projects that use:

- GNU make
- CMake
- autotools
- Visual Studio
- Meson

### C++

3 routes

- JS people

  npm create cheerp

```ts
import add from "./add.cpp"; // or CMakeLists.txt?

add(1, 2); // 3
```

Do you like TypeScript? yes

node_modules
src/
index.cpp

- C++ people

  - I have an existing C++ codebase I want to port to the web

  - I want to make a library available to JS developers
    - package.json
    - upload to npm, JSR
