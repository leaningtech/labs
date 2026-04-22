---
title: CheerpX
description: The x86 virtualization technology for running executables and operating systems entirely client-side.
demo_url: https://cheerpx.io/
repository_url: https://github.com/leaningtech/cheerpx-meta
author: Leaning Technologies
project_type: Company Product
niche: Virtual Machines
tags:
  - Cheerp
hero_image: "./cheerpx.png"
---

## What is CheerpX?

CheerpX is a powerful x86 virtualization library designed to run unmodified binary applications and libraries in the browser. It leverages a WebAssembly-based sandbox and standard browser APIs to ensure security, even when executing untrusted code. CheerpX supports Linux-compatible system calls and can run many common applications, including complete Linux distributions.

## How it works

At its core, CheerpX is a two-tier emulator for the x86 architecture implemented in C++ that has been compiled to JavaScript and WebAssembly using Cheerp. CheerpX features an advanced Just-In-Time compiler that dynamically translates x86 code to WebAssembly as needed. This engine is highly robust, capable of handling dynamically generated and self-modifying code.

## What is it used for?

CheerpX is the core technology behind WebVM, one of our most successful public demos with 16k stars on GitHub, as well as Alpine WebVM and the Games Runner browser extension.

You can learn more about CheerpX on our [documentation site](https://cheerpx.io/docs/overview).
