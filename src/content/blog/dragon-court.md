---
title: "Reviving the Dragon Court browser RPG with CheerpJ"
description: |
  Dragon Court was a free, old-school fantasy, multiplayer browser RPG that came in a Java Applet format but sadly became abandonware.
  Clarky Lee talks about how he used CheerpJ to bring it back to life.
authors:
  - guest-penguinchilling
pubDate: 2023-12-14
heroImage: "./dragon-court.png"
tags:
  - CheerpJ
---

This is the first guest post from the [CheerpJ developer community](/cheerpj3/community). Clarky Lee talks about how he used [CheerpJ](/cheerpj3) to bring back a 90s RPG, Dragon Court.

---

Dragon Court was a free, old-school fantasy multiplayer browser RPG that came in a Java Applet format. It featured a large number of limited hero actions that would be refreshed daily, leading to a daily login habit from engaged players. It was created by Fred Haslam, and is believed to have been originally released around 1997.

[Dragon Court: Revived](https://dragoncourt.penguinchilling.com/) is a project to bring back the nostalgic game for fans, and to continue development of the game in terms of end-game content, balancing, bug fixes, and modern quality of life changes. It will continue to be forever free to play, without micro-transactions.

![](./dragon-court-classes.png)

## Why revive it?

I grew up playing online browser games like Dragon Court because my parents would send me to the public library on weekends hoping I would immerse myself with books. I would instead use the library computers to find and play online games. I also brought this habit to my school computers during weekdays and
Dragon Court was one of the few games that were not blocked at school. Dragon Court, I would say, had one of the earliest "energy" systems that we see in Facebook/mobile free to play games. That game loop was serious about getting me in a daily habit of signing in and I was hooked!

The original Dragon Court is no longer playable, both because Java Applet support was removed from browsers, and that the original creator was no longer interested in maintaining it. Sadly, it became abandonware.

While there have been other efforts to bring back Dragon Court in some form, they were either based on an older version of the client source, missing the server source, or were remakes based on fan memories.

[CheerpJ](/cheerpj3) was the perfect solution to make Dragon Court run in the browser again, and to continue development of the game. CheerpJ is a Java Virtual Machine that runs in the browser, and is able to run applets from a .jar binary file.

## Early steps

After coming across CheerpJ 2 and finding the last known .jar binary on the Internet Archive's [Wayback Machine](https://archive.org/web/), I decided to build a local server to see how far CheerpJ would go with the recovered game binary embedded on a page. The initial tests were very successful with the game rendering the login screen.

Out of the box, CheerpJ support was easily able to handle network requests for images and render content built in Java AWT.

From here, I began picking up on the failed network requests from the game binary and implementing server handling of the requests. The initial version was pretty straightforward in terms of utilizing CheerpJ and having the mostly original binary talking to the server.

In addition to the essential loading and saving for player data with the server database, the in-game mail and clan management functions are now also replicated and functioning on the Dragon Court: Revived server.

## Updating the client

A large segment of the project was deobfuscating the original .jar binary so bug fixes and new features could be added. It was a long and arduous process that is still ongoing, but development of new features and bug fixes has gradually become accelerated. The project originally started primarily of server development efforts, but has since shifted towards client development thanks to the untangling of the original binary that is now recompilable.

Development from hereon was able to continue like a regular client project, and CheerpJ made the new client build pipeline possible, and without hindrance.

### Touch device support with JS-Java interop

One of the interesting problems that did come up was that the touch device support for Java 8 did not truly exist at the time and some elements like touch device keyboard input was not available. Touch support was highly desired by mobile device players who were unable to login.
Thankfully, CheerpJ allows you to [invoke Java methods from a page's JavaScript](/cheerpj3/reference/cheerpjRunLibrary#cj3library), and a login widget was effectively able to communicate with the game client to bypass the keyboard requirement for touch devices.

### User preference persistence with cookies

Another quality of life concern was persisting a few user preferences in the original game binary. These would normally be reset on subsequent launches, but with CheerpJ, reading and saving them with browser cookies became possible.

### Custom fonts

Another challenge, was keeping the original font the game used, which used to assume a requested font would be provided by the operating system. By not using the original font, text alignment was not quite accurate and would either be truncated or be overlayed across other text elements in numerous parts of the game. Since the initial release, and with the support of CheerpJ, the game is now able to load custom fonts hosted on the game server and render as originally intended.

## What's next for Dragon Court: Revived

Dragon Court: Revived is undergoing development for it's next major content release, The Depths of Glimmerforge Caverns. It includes new leveling and end-game zones, more loot, balance changes, and quality of life changes to address player feedback. The game data is also being separated from the client binary to allow additional game balancing without the needing a client release.

[Play Dragon Court: Revived](https://dragoncourt.penguinchilling.com/DCourt/Game.html)

---

CheerpJ is a WebAssembly-based Java Virtual Machine for the browser. It runs Java applications, applets, libraries, and Java Web Start / JNLP applications in the browser without plugins. **Interested in using CheerpJ in your own project?** [Get started here.](/cheerpj3)

Thanks for reading the first in a series of guest posts from our [developer community](/cheerpj3/community)! If you're interested in writing a guest post, please get in touch on our Discord server.
