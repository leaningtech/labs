---
title: Glossary
description: Key terms and definitions used in BrowserPod documentation
---

## Backend

The server-side part of a system that runs outside the browser.

## BrowserPod API

The JavaScript API for controlling a Pod. Provides methods for booting Pods, running processes (`pod.run`), managing the virtual filesystem, and handling Portals. Used to execute code and manage the runtime environment entirely within the browser.

## COOP and COEP

HTTP headers required for cross-origin isolation so the browser can enable `SharedArrayBuffer`.

## Current working directory (cwd)

The directory used to resolve relative paths for the current process.

## Virtual filesystem

A filesystem created and managed in software rather than on the user’s real disk.

## Pod

A running [BrowserPod](/docs/reference/BrowserPod) instance. Each Pod provides a sandboxed runtime environment with its own virtual filesystem, process space, and network layer. Pods run entirely in the browser and are ephemeral by default. They exist only while the browser tab is active. Though if preferred you can enable file persistence across sessions by passing `storageKey` when [`booting`](/docs/reference/BrowserPod/boot) the Pod.

## Portal

A secure, shareable URL that routes external traffic to a service listening on a port inside the Pod. Portals are created automatically when code binds to a port, enabling features like live previews, interactive demos, and collaborative workflows without requiring dedicated backend infrastructure.

## REPL

“Read–eval–print loop.” An interactive prompt that reads input, runs it, and prints the result.

## Runtime

The environment that executes your code.

## Wasm (WebAssembly)

A binary format that allows code to run in the browser at near-native speed. See the [MDN documentation](https://developer.mozilla.org/en-US/docs/WebAssembly) for more.

## Terminal

A virtual device used to communicate with processes spawned in a Pod.
It provides input and displays output in the form of characters.

The default terminal used by BrowserPod uses Xterm.js, a terminal emulator library
for the browser. See the [Terminal reference](/docs/reference/Terminal) for the API.

## System image

The prebuilt filesystem that every Pod starts with when you
[boot](/docs/reference/BrowserPod/boot) it. It contains the software
available inside a Pod out of the box: `bash`, `git`, Node.js and npm, and
a set of standard Linux command-line utilities.

The system image is provided by BrowserPod and is the same for every Pod.
Anything it does not include has to be copied or installed into the Pod
yourself, or supplied through a [user image](#user-image).

## User image

An optional filesystem image of your own, passed to
[boot](/docs/reference/BrowserPod/boot) as `userImage` and mounted on the
Pod's `/home` directory. It does not replace the system image, it sits
alongside it, so a Pod can start with your own files already in place
instead of copying them in at runtime.

User images are ext2 images that you host yourself and reference by URL.

## Target

The platform a program is compiled to run on. A program built for one target won't run on another. A Windows program won't run on a Mac, and a BrowserPod binary won't run on your host machine.

## Cross-compilation

Compiling a program for a platform other than the one you're compiling on. For example, building a Windows .exe on a Mac, or building a BrowserPod wasm binary on a Linux machine.
