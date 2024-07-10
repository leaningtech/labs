---
title: Sourcemaps
description: Generate source maps with `-cheerp-sourcemap`
---

Cheerp can generate [source maps](https://web.dev/articles/source-maps) together with the final compiled JavaScript file:

```sh "-g -cheerp-sourcemap=file.js.map"
/opt/cheerp/bin/clang++ file.cpp -o file.js -g -cheerp-sourcemap=file.js.map
```

The standard `-g` option is used to generate debugging information in the frontend.
The Cheerp-specific `-cheerp-sourcemap` option instructs Cheerp to output the source map file in the given file. You can of course use any name for the source map file.

## Related options

- `-g` Required to get the compiler to generate debugging metadata
- `-cheerp-sourcemap=filename` Tells Cheerp where to output the sourcemap
- `-cheerp-sourcemap-prefix=path` Tells Cheerp to remove the given prefix from all the source files paths that are stored inside the sourcemap.
- `-cheerp-sourcemap-standalone` Tells Cheerp to include all sources into the sourcemap file. This makes it easier to debug using sourcemap since you only need to put the map file on the Web Server, instead of the whole source code. Since the map contains the sources you should remember not to deploy this file in production.

## Capabilities

When sourcemaps are enabled you can:

- Set break points in C++ code
- Single-step through C++ code
- See C++ code when an exception is raised

## Limitations

The sourcemap standard does not allow any kind of variable inspection or mapping source variable to compiled variables.

This means that it is not possible to watch the values of C++ variables or change them. We plan to enable this possibility when the standard will support it.
