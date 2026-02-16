---
title: Glossary
description: Key terms and definitions used in BrowserPod documentation
---
## API

A set of functions or rules that let two pieces of software talk to each other.

## Arguments (args)

Extra pieces of information passed to a command.

## Await / async

`async` marks a function as able to pause. `await` pauses until a promise finishes.

## Backend

The server-side part of a system that runs outside the browser.

## BrowserPod API

The set of methods (like `pod.run` and file APIs) used to control the pod. New processes are started through the API, not by typing in the terminal.

## CheerpOS

A runtime that provides Linux-like syscalls to Wasm programs. BrowserPod's Node.js build targets CheerpOS.

## Class

A blueprint for creating objects.

## Command

A program you run inside the pod, like `node` or `npm`.

## Command line

A text input where you type commands and see their output.

## COOP and COEP

HTTP headers required for cross-origin isolation so the browser can enable `SharedArrayBuffer`.

## Current working directory (cwd)

The folder a command runs from.

## Dependency

A library your project needs in order to run.

## DOM element

A single piece of a webpage, like a `div` or `button`.

## Filesystem

The structure of folders and files inside the pod.

## Foreground process

The currently active program attached to the terminal. It receives stdin and can control the terminal while it runs.

## Function

A reusable block of code that does something. You can call it to run it.

## Instance

A specific, working object created from a class.

## Method

A function that belongs to an object.

## Object

A container that groups related values and functions together.

## Package

A bundle of code you can install, usually with npm.

## package.json

A file that describes a Node.js project and its dependencies.

## Pod

A running BrowserPod instance that includes a Node.js runtime, virtual filesystem, and process runner.

## Portal

A public URL that forwards external traffic to a port inside the pod.

## REPL

“Read–Evaluate–Print Loop.” An interactive prompt that reads input, runs it, and prints the result.

## Runtime

The environment that executes your code.

## Virtual filesystem

A filesystem created and managed in software rather than on the user’s real disk.

## Wasm (WebAssembly)

A binary format that allows code to run in the browser at near-native speed. See the [mdn documentation](https://developer.mozilla.org/en-US/docs/WebAssembly) for more.


## Terminal

A virtual device used to communicate with processes spawned in a pod.
It provides input and displays output in the form of characters.

The default terminal used by BrowserPod uses Xterm.js, a terminal emulator library
for the browser.

