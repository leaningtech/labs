---
title: Changelog
description: "Release notes and version history for BrowserPod, covering new features, runtime improvements, and bug fixes across each release."
---

## Version 2.14.0:

- Both the kernel and the userspace programs now support resizable memory, and start with the minimum memory required
- Fixed a bug with futex not properly removing a thread from the queue when woken up by an signal

## Version 2.13.0:

- Activate the Bun polyfill only under the --browserpod-polyfill-bun cli argument

## Version 2.12.1:

- Fix a regression in the previous version

## Version 2.12.0:

- Fix bugs with larger DNS responses
- Improved support for signal handlers

## Version 2.11.0:

- Polyfill some bun APIs

## Version 2.10.0:

- Simplified rust builds

## Version 2.9.0:

- Preliminary support for Rust

## Version 2.8.0:

- Introduce ephemeral mode

## Version 2.7.0:

- Improve support for typed arrays

## Version 2.6.2:

- Improve terminal scrolling support

## Version 2.6.1:

- Improve terminal resizing support

## Version 2.6.0:

- Introduce the onOpen callback
- Network stability improvements

## Version 2.5.0:

- Stability improvements

## Version 2.4.0:

- Stability improvements

## Version 2.3.4:

- Fix npm init

## Version 2.3.3:

- Internal testing release

## Version 2.3.2:

- More fixes for Gemini CLI

## Version 2.3.1:

- Multiple fixes for Gemini CLI

## Version 2.3.0:

- Improvements to syscalls implementation
- Improved support for postMessage
- Improved support for WASI
- Network stability improvements

## Version 2.2.1:

- Fix a Next.js bug in production builds

## Version 2.2.0:

- Improvements to disk performance

## Version 2.1.0:

- Initial support for Next.js 16
- Improvements to syscalls implementation
- Improvements to disk performance
- Improvements to network performance
- Support full-color terminal
- Multiple stability fixes

## Version 2.0.0:

- **Added support for command-line tools**: git, bash, curl, grep, openssl, vi, and many others
- Improvements to disk performance
- Increase available space at the `/home` mount point to 2 GB
- Support multiple independent virtual disks via the `storageKey` init option

## Version 1.3.1:

- Fix detection of WebAssembly programs

## Version 1.3.0:

- Improvements to syscalls implementation
- Network performance improvements
- Initial support for WebAssembly programs

## Version 1.2.0:

- Support for /dev and /proc
- Support larger disk images
- Support for npx
- Improvements to syscalls implementation
- Improvements to terminal sizing
- Improvements to fork and execve
- Performance improvements

## Version 1.1.2:

- Fix timestamping of OPFS devices

## Version 1.1.1

- Fixed a performance regression

## Version 1.1.0

- Support for most major frameworks: Next.js, Nuxt, Express, Svelte, React, ...
- Support HTTP compression via portals
- Support more system calls
- Improvements to process spawning and PATH handling
- Improvements to Worker support
- Report uncaught exceptions

## Version 1.0.0

- Faster `BrowserPod.boot()`

## Version 0.9.10

- Improved overall disk performance
- Enabled the OPFS disk backend by default
- Bug fixes

## Version 0.9.8

- Fixed an internal error that could leave the kernel in a deadlocked state
- Added support for reporting unhandled promise rejections

## Version 0.9.7

- Fixed a regression introduced by reducing the thread pool size

## Version 0.9.6

- Fixed a crash when formatting some types
- Fixed formatting of objects with a null prototype

## Version 0.9.5

- Improved the look of `browserpod-quickstart` templates

## Version 0.9.4

- Fixed an issue with `browserpod-quickstart`

## Version 0.9.3

- Fixed a few issues
- Added the `browserpod-quickstart` package

## Version 0.9.2

- Added support for the Node.js REPL
- Added TypeScript types
- First public beta release

## Version 0.9.1

- NPM automation

## Version 0.9.0

- First NPM release
