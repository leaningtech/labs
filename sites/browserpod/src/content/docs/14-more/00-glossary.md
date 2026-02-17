---
title: Glossary
description: Key terms and definitions used in BrowserPod documentation
---


## Backend

The server-side part of a system that runs outside the browser.

## BrowserPod API

The set of methods (like `pod.run` and file APIs) used to control the pod. New processes are started through the API, not by typing in the terminal.

## CheerpOS

A runtime that provides Linux-like syscalls to Wasm programs. BrowserPod's Node.js build targets CheerpOS.

## COOP and COEP

HTTP headers required for cross-origin isolation so the browser can enable `SharedArrayBuffer`.

## Current working directory (cwd)

The directory used to resolve relative paths for the current process

## Virtual filesystem

A filesystem created and managed in software rather than on the user’s real disk.

## Pod

A running BrowserPod instance

## Portal

A public URL that forwards external traffic to a port inside the pod.

## REPL

“Read–Evaluate–Print Loop.” An interactive prompt that reads input, runs it, and prints the result.

## Runtime

The environment that executes your code.

## Wasm (WebAssembly)

A binary format that allows code to run in the browser at near-native speed. See the [mdn documentation](https://developer.mozilla.org/en-US/docs/WebAssembly) for more.

## Terminal

A virtual device used to communicate with processes spawned in a pod.
It provides input and displays output in the form of characters.

The default terminal used by BrowserPod uses Xterm.js, a terminal emulator library
for the browser.
