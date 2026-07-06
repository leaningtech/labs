---
title: Concordia
description: A multi-agent coordination framework executing Claude-driven agents inside BrowserPod synced with Minecraft.
repository_url: https://github.com/0-robert/Concordia
author: Agentic
project_type:
  - Hackathon Project
niche: Collaborative AI
tags:
  - BrowserPod
score: 85
hero_image: "./concordia.png"
---

## What is Concordia?

Concordia is an orchestration framework that coordinates four independent, Claude-driven AI agents working together in a shared virtual space. It provides a visual and debuggable interface for multi-agent systems, using Minecraft as the rendering layer while running the underlying communication and coordination protocol inside BrowserPod. The Agentic team was composed of Robert Vassallo.

The project won **3rd Place** at the 2026 AI in the Box Hackathon.

## What the demo includes

- **Emergent Division of Labour**: Agents use natural language to divide the map, share inventory states, and cooperate to complete goals (like mining diamonds) without a central orchestrator.
- **Human-in-the-Loop Intervention**: Users can scan a QR code to manually take control of a single agent via a phone controller while the remaining three agents continue working autonomously around them.
- **Observability Interface**: A real-time stream showcasing each agent's current thoughts, tool invocations, active chat messages, and inventory status alongside a live "god-view" map.

## How it works

Concordia's backend and public control plane run entirely inside a BrowserPod Node.js container launched from a single browser tab.

The orchestrator utilizes three basic primitives—`team()` (read sibling state), `chat()` (broadcast intent), and `deposit()` (log results). To connect external controllers (such as a judge's phone on local venue Wi-Fi), BrowserPod starts an Express server and a WebSocket relay. By leveraging BrowserPod's outbound port portal, the sandboxed server is exposed via a public HTTPS/WSS link. This network inversion bypasses local NAT and firewalls, allowing external devices to connect securely. The Anthropic Claude API proxy stays server-side inside the BrowserPod container to keep secret keys secure.
