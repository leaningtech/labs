---
title: CommonMark — Library Mode
description: A browser-based Markdown editor powered by a Java library running through CheerpJ.
demo_url: https://leaningtech.github.io/cheerpj-demo-commonmark/
repository_url: https://github.com/leaningtech/cheerpj-demo-commonmark
author: Leaning Technologies
project_type:
  - Company Demo
niche: Developer Tools
tags:
  - CheerpJ
score: 60
hero_image: "./cheerpj-commonmark.png"
---

A live Markdown editor that uses the CommonMark Java library directly in the browser through CheerpJ. As you type, Markdown text is passed from JavaScript to Java, parsed and rendered as HTML by CommonMark, then injected back into the preview pane, with no server-side processing required.

This demo showcases CheerpJ’s library mode, where a web page can call into a JAR much like it would call a JavaScript library. JavaScript handles the UI and editor state, while Java performs the Markdown parsing and HTML rendering. It demonstrates how existing JVM libraries can be reused on the web without being rewritten in JavaScript.

The demo runs on CheerpJ’s Java 17 WebAssembly runtime and uses `commonmark-0.27.1.jar`.
