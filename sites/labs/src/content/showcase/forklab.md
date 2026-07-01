---
title: ForkLab
description: Verify AI-generated code branches inside disposable browser sandboxes before patching production code.
demo_url: https://forklab-ai-hackathon.vercel.app/
repository_url: https://github.com/Jyozaa/Forklab-AI-hackathon
author: Meal Deal
project_type:
  - Hackathon Project
niche: Developer Tools
tags:
  - BrowserPod
score: 90
hero_image: "./forklab.png"
---

## What is ForkLab?

ForkLab is a client-side execution environment designed to bridge the trust gap when using AI coding assistants. It allows developers to safely run, inspect, and verify AI-generated patches and test suites inside isolated, disposable browser containers before adopting the code changes.

The project won **2nd Place** at the 2026 AI in the Box Hackathon.

## What the demo includes

- **Command Center (/try)**: A central dashboard managing prompt templates, task runners, placeholder configurations, and git branches.
- **Interactive Sandbox (/sandbox-test)**: A real-time playground that boots a runtime environment, writes code files, runs execution commands, and streams log outputs.
- **Patch Verification Sprint (/sprint)**: A demonstration of a deterministic bug-fixing loop that loads a CSV export project, executes a failing test suite, applies an AI-generated patch, and reports a passing proof state.

## How it works

ForkLab is built as a Next.js application leveraging BrowserPod as its core execution engine.

When a user triggers a code execution task, ForkLab spins up a BrowserPod sandbox completely client-side in the user's browser tab. Because BrowserPod utilizes WebAssembly to run full server-side runtimes (like Node.js v22), ForkLab can write files directly to the virtual filesystem, install dependencies, run test scripts, and capture standard terminal output. Security headers (COOP/COEP) are configured on the Next.js routes to allow `SharedArrayBuffer` isolation, keeping the untrusted code entirely sandboxed away from the developer's local operating system.
