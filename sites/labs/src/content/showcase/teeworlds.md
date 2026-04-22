---
title: TeeWorlds
description: Retro, multiplayer 2D shooting game running in the browser using Cheerp, WebRTC, and Firebase.
demo_url: https://teeworlds.leaningtech.com
repository_url: https://github.com/leaningtech/cheerpnet
author: Leaning Technologies
project_type: Company Demo
niche: Videogames
tags:
  - Cheerp
hero_image: "./teeworlds.png"
---

## What is it?

Our team has ported the classic C++ multiplayer game Teeworlds to run entirely in a web browser, using Cheerp, WebRTC, and Firebase as the core technologies. The aim was to move both the client and server components of the game into the browser with minimal changes to the original codebase using modern web technologies.

## The networking challenge

A key challenge was networking. Standard web approaches like HTTP or WebSockets rely on TCP, which introduces latency and ordering guarantees that are poorly suited for fast-paced games. To solve this, our team used WebRTC, which supports both reliable and unreliable data channels and can approximate UDP-style communication in the browser. WebRTC enables peer-to-peer connections and works across NATs using ICE, STUN, and TURN, but it requires a separate signalling mechanism to establish connections between peers.

## How it works

Cheerp, a C++ compiler that targets WebAssembly and JavaScript, was used to compile both the game client and server logic to run inside the browser. To avoid rewriting large portions of the game, the authors implemented a socket-like abstraction that mimics UDP networking while internally using WebRTC data channels. Instead of IP addresses, peers are identified using unique keys, and WebRTC connections are created lazily only when data is first sent.

For signalling, matchmaking, and server discovery, Firebase was used. Firebase stores the list of available game sessions and handles the exchange of WebRTC connection metadata between peers. This architecture allows one player's browser to act as the game server, resulting in a fully serverless multiplayer game that can be deployed as static web content. The project shows that complex C++ multiplayer games can be brought to the web with minimal refactoring while retaining real-time performance.

You can read more details about this demo [here](https://medium.com/leaningtech/porting-a-c-multiplayer-game-to-the-web-with-cheerp-webrtc-and-firebase-29fbbc62c5ca).
