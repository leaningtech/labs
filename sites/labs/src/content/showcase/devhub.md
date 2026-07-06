---
title: DevHub
description: Group, analyze, and safely execute multiple GitHub repositories in the browser using local AI and BrowserPod.
repository_url: https://github.com/IlanRV/Frontend
author: DevHub
project_type:
  - Hackathon Project
niche: Software Security
tags:
  - BrowserPod
score: 95
hero_image: "./devhub.png"
---

## What is DevHub?

DevHub is a multi-repository developer workspace that allows developers to group multiple GitHub repositories into a single workspace, browse files, run projects safely in the browser, and perform AI-powered codebase analysis. The DevHub team was composed of Yusuf Demir, Naidan Salvador, and Ilan Ramirez.

The project was awarded **1st Place** and the **Software Security Award** at the 2026 AI in the Box Hackathon.

## What the demo includes

- **Workspace Organizer**: Group related frontend and backend repositories into unified workspaces.
- **AI Code Chat**: Ask natural language questions about single repositories or across the entire multi-repo workspace.
- **Persisted Code Browsing**: View cached file contents and directory hierarchies, serving code tree updates instantly even if the sandbox environment is offline.
- **Security Audit Logs**: Track static and runtime security events (such as suspicious dependencies or risky lifecycles) reported directly from the sandboxed workspace.

## How it works

DevHub's architecture uses a React/TypeScript frontend communicating with an Express/TypeScript server via the BrowserPod SDK.

When a user adds a GitHub repository, the frontend boots a BrowserPod instance entirely inside the browser to securely clone the codebase. The frontend reads files locally in the browser sandbox and sends the structural metadata to the Firestore backend. The backend triggers asynchronous AI analysis (using OpenRouter/Claude) to calculate dependency graphs, security risks, code summaries, and runtime compatibility notes. If a project is runnable, the frontend spins up its runtime server inside the BrowserPod container and exposes it to the web using BrowserPod's port portals.
