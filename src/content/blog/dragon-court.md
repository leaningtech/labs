---
title: "Bringing the Dragon Court game back to life with CheerpJ"
description: |
  Dragon Court is a free, old-school fantasy, online browser RPG that came in a Java Applet format but sadly became abandonware.
  Clarky Lee talks about how he used CheerpJ to bring it back to life.
authors:
  - alex # TODO
pubDate: 2023-11-26
heroImage: "./cheerp-lines.png" # TODO
tags:
  - CheerpJ
---

Dragon Court is a free, old-school fantasy, online browser RPG that came in a Java Applet format. It featured a large number of limited hero actions that would be refreshed daily, leading to a daily login habit from engaged players. It was created by Fred Haslam, and is believed to have been originally released around 1997.

Dragon Court: Revived, is the project to bring back the nostalgic game for fans, and to continue development of the game in terms of end-game content, balancing, bug fixes, and modern quality of life changes. It will continue to be forever free to play, without micro-transactions.

## Why Revive It?

Ultimately, the game was no longer playable, and is highly attributed to the withdrawal of Java Applet support from modern browsers, and that the original creator was no longer interested in maintaining Dragon Court due to various reasons. Over the recent years, there have been talks in the Dragon Court community of transitioning the original Dragon Court source of the client and server from Haslam, but there has been scarce updates, and most fans considered it abandonware at this point.

While there have been other efforts to bring back Dragon Court in some form, they were either based on an older version of the client source, missing the server source, or remakes based on fan memories.

## The Early Steps

After coming across CheerpJ (v2) and finding the last known .jar binary on the Internet Archive's Wayback Machine (https://archive.org/web/), I decided to build a local server to see how far CheerpJ would go with the recovered game binary embedded on a page. The initial tests were very successful with the game rendering the login screen.

Out of the box, CheerpJ support was easily able to handle network requests for images and render content built in Java AWT.

From here, I began picking up on the failed network requests from the game binary and implementing server handling of the requests. The initial version was pretty straightforward in terms of utilizing CheerpJ and having the mostly original binary talking to the server.

In addition to the essential loading and saving for player data with the server database, the in-game mail and clan management functions, are now also replicated and functioning on the Dragon Court: Revived server.

## Client Updates

An intense segment of the project was unobfuscating the original .jar binary so bug fixes and new features could be added. It was a long and arduous process that is still ongoing, but development of new features and bug fixes has gradually become accelerated. The project originally started primarily of server development efforts, but has since shifted towards client development thanks to the untangling of the original binary that is now recompilable.

Development from hereon was able to continue like a regular client project, and CheerpJ made the new client build pipeline possible, and without hindrance.

One of the interesting problems that did come up, was that the touch device support for Java 8 did not truly exist at the time and some elements like touch device keyboard input was not available. Touch support was highly desired by mobile device players who were unable to login. Thankfully, CheerpJ provided Applet JSObject support and invoking Applet methods from a page's JavaScript, and a login widget was effectively able to communicate with the game client to bypass the keyboard requirement for touch devices.

Another quality of life concern, was persisting a few user preferences in the original game binary. These would normally be reset on subsequent launches, but with CheerpJ, reading and saving them with browser cookies and JSObject support became possible.

Another challenge, was keeping the original font the game used, which used to assume a requested font would be provided by the operating system. By not using the original font, text alignment was not quite accurate and would either be truncated or be overlayed across other text elements in numerous parts of the game. Since the initial release, and with the support of CheerpJ, the game is now able to load custom fonts hosted on the game server and render as originally intended.

## What's Next for Dragon Court: Revived

Dragon Court: Revived is undergoing development for it's next major content release, The Depths of Glimmerforge Caverns. It includes new leveling and end-game zones, more loot, balance changes, and quality of life changes to address player feedback! The game data is also being separated from the client binary to allow additional game balancing without the needing a client release.

More Info on Dragon Court: Revived
Play the game free here - https://dragoncourt.penguinchilling.com/
Join the Dragon Court Discord community - https://discord.gg/F8kAM5c3Gy
Support the development of Dragon Court: Revived - https://ko-fi.com/E1E5PRKC1
