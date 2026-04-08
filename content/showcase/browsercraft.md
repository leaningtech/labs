---
title: Browsercraft
description: Minecraft running unmodified in the browser!
demo_url: https://browsercraft.cheerpj.com/
repository_url: https://github.com/leaningtech/browsercraft
author: Leaning Technologies
project_type: Company Demo
niche: Videogames
tags:
  - CheerpJ
hero_image: "./browsercraft.png"
---

Browsercraft runs unmodified Minecraft (version 1.2.5) in the browser using CheerpJ, a Java runtime for modern browsers. The original client.jar is fetched directly from Mojang's servers on your browser and executed without any modification. The experience is intentionally limited to 3 minutes; please refer to [minecraft.net](https://www.minecraft.net/) for the full game.

## What this is not
It is not a replacement for the official Minecraft, nor a reimplementation in another programming language. This is also not a modified version of the game: we do not alter the code in any way, we simply run the original JARs. It is not based on decompilation or reverse engineering of any kind.

## How it works
CheerpJ is a full WebAssembly-based JVM for the browser, and comes with a complete OpenJDK runtime, as well as a powerful emulation layer to provide file system access, general networking support and other OS-level features. It works fully client-side, via WebAssembly, JavaScript and HTML5 technologies — with no server-side or cloud-based component of any sort. It can execute any Java application from unmodified JARs, without requiring the source code.

LWJGL support is particularly interesting to explain. LWJGL is only superficially Java — most of its value comes from JNI methods which provide direct access to OpenGL, written in C and automatically generated from a declarative representation of the OpenGL API. CheerpJ handles this via JNI WebAssembly modules, which are loaded and executed dynamically, similarly to how shared libraries work on native platforms. Browsercraft also makes use of gl4es, a compatibility layer that bridges OpenGL (used by Minecraft) and GLES as provided by WebGL.
Minecraft is a notoriously a resource-intensive application, so it serves as a genuine stress test for CheerpJ. Thanks to recent improvements in CheerpJ's JIT compiler, the demo runs with satisfactory performance on most mid-range machines. 
