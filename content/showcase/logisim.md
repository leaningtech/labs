---
title: Logisim.app
description: A complete, browser-based port of the classic Logisim logic circuit simulator.
demo_url: https://logisim.app/
repository_url: https://github.com/De-Rossi-Consulting/logisim.app
author: Ethan Hale, Martin Nyaga
project_type: Community
niche: Scientific
tags:
  - CheerpJ
hero_image: "./logisim.png"
---

## What is Logisim.app?

Explore how modern computers work by building them from the ground up. Logisim.app lets you design logic circuits — from simple adders and multiplexers to full ALUs and CPUs — in exactly the same way as the classic Logisim by Carl Burch. Requiring no downloads or setup, it is fully compatible with existing Logisim circuits and instantly available on the web.

## How it works

Logisim.app is a 1:1 port that works by running Java on a WebAssembly JVM via CheerpJ. The Java codebase is the same as the original, with a few targeted modifications to allow Logisim to work within the browser's secure sandbox — including letting users open and save files to disk.
