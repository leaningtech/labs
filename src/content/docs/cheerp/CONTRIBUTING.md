---
title: How to Contribute
shortTitle: Contributing
slug: cheerp/contributing
---

Cheerp is one of Leaning Technologies' first open source projects that is both under very active development and is used internally and externally by lots of people. We're still working out the best way to accept contributions to Cheerp, but we're excited to have you here.

To get started with contributing to Cheerp, please introduce yourself in the `#cheerp` channel on [our Discord server](https://discord.leaningtech.com).

Please also consider reading the [main contributing guide](/contributing) which applies to all Leaning Technologies projects.

## Structure

Cheerp's codebase is spread across a few repositories. These are:

- [cheerp-meta](https://github.com/leaningtech/cheerp-meta) - main repository for tracking issues and releases
- [cheerp-compiler](https://github.com/leaningtech/cheerp-compiler) - the compiler internals, based on the LLVM repository
- [cheerp-musl](https://github.com/leaningtech/cheerp-musl) - a Cheerp-enabled implementation of [musl libc](https://musl.libc.org/)
- [cheerp-utils](https://github.com/leaningtech/cheerp-utils) - a collection of utilities and headers shipped with Cheerp
- [cheerp-libs](https://github.com/leaningtech/cheerp-libs) - a collection of helpful libraries for use with Cheerp, such as a GLES implementation
- [ts2cpp](https://github.com/leaningtech/ts2cpp) - a tool to generate C++ headers from TypeScript declaration files for use with Cheerp

## Roadmap

We are working on publishing a roadmap for Cheerp. In the meantime, please check the [GitHub issues](https://github.com/leaningtech/cheerp-meta/issues) or the [latest PRs](https://github.com/leaningtech/cheerp-compiler/pulls?q=). We also publish a weekly devlog on [Discord](https://discord.leaningtech.com).

## Documentation

Thanks for thinking about contributing to the Cheerp documentation. That's awesome.

### Style guide

The Cheerp documentation should follow the [Leaning Technologies documentation style guide](/contributing#style-guide). Please read this before contributing.

### User stories

We think there are 4 types of people who want to use Cheerp. These are:

1. **C++ application developers**: I have an existing C++ application I want to port to the web
1. **C++ library authors**: I have an existing C++ library I want to make available to JavaScript developers
1. **Web developers**: I have an existing JavaScript/TypeScript codebase and I want to add a little C++ to it
1. **Noobs**: I don't know how to program but I want to learn how to make webapps with C++

The current documentation focuses on (1). We are looking to allow (2) as well, then (3) and (4) later.

### C++ developers

#### Package managers

People with a C++ background want to install Cheerp with their typical package manager (probably on Linux). Ideally, we maintain a select few packages and community members maintain packages for more niche distributions. The packages we maintain are:

- Linux
  - Ubuntu
  - Arch
  - Nix
- macOS
  - Homebrew
  - Nix (via [nix-darwin](https://daiderd.com/nix-darwin/))
- Windows
  - Graphical installer

#### Quickstart guides

We want quickstarts for people that use the following build tools (in order of priority):

- GNU make
- CMake
- Visual Studio
- autotools
- Meson

If there's a C++ build tool that you use and its not particularly niche, please consider contributing a quickstart guide for it!

#### 'Make your C++ library available to webdevs' tool

We'd like to provide a CLI that lets one easily convert their C++ library into a JavaScript/TypeScript library that can be `npm publish`ed.

This would probably be provided as part of the [`cheerp` CLI](#cheerp-cli-and-api) installed via pnpm.

### Web developers

People with a web development background tend to expect a way to install and integrate Cheerp with their existing codebase, using the tools they already use, like [npm](https://npm.im) and [Vite](https://vitejs.dev/) (which uses Rollup).

#### `cheerp` CLI and API

The [Cheerp package](https://github.com/leaningtech/cheerp-meta) is both a way to install the Cheerp CLI but also provides an isomorphic TypeScript API for people to use Cheerp easily both in the browser and in server runtimes like Node.js. In future, we can look into publishing Cheerp for other runtimes (e.g. Deno, Bun) for example by publishing a `@leaningtech/cheerp` [JSR](https://jsr.io/) package.

The CLI should vendor native builds of Cheerp where possible, falling back to running Cheerp via WebAssembly (for example using CheerpX). It's probably not appropriate to try to use already-installed versions of Cheerp.

Running `cheerp env` should set up the environment to provide Cheerp binaries on the PATH as `clang++` etc.

You can also use `npx cheerp clang++` to temporarily install and run Cheerp directory.

#### Build tools

We can provide a cool plugins for build tools like Parcel and Vite which allow people to easily sprinkle in a bit of C++ into their existing projects.

```ts
import add from "./add.cpp"; // or CMakeLists.txt/similar?

add(1, 2); // 3
```

#### `create-cheerp`

We also want a `create-cheerp` npm package which allows people to easily scaffold and initialise a project that uses Cheerp.

This is also appropriate for C++ people looking to make new web apps using C++ and modern JS tooling.

For example, it could ask questions like:

```
Do you want to use TypeScript? yes
Do you want to use Vite? yes
```

Which generates a project like:

```
node_modules
src/
  index.cpp
index.html
vite.config.ts
```

### Noobs

We are not particularly interested in teaching people with little C++ and/or JavaScript experience. Perhaps this will change in future as we have more bandwidth, but unless a community member is interested in working on this it won't be made a priority in the near term.

The ideal for this is a site similar to the Svelte tutorial which teaches how to use Cheerp as a language extension to C++, which doesn't assume much C++ knowledge so it is appropriate for noobs. For example it will explain briefly C++ concepts, and explain everything that Cheerp introduces to C++ like `[genericjs]`. It can use the Cheerp package to run Cheerp in the browser and use something like CodeMirror or client-side Theia as the editor.
