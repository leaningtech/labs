---
title: Greencode
description: Audit Python code for energy efficiency and carbon intensity using AST parsing inside BrowserPod.
repository_url: https://github.com/AbhishekVishwagna/Greencode
author: Team Mumbaikars
project_type:
  - Hackathon Project
niche: Sustainability
tags:
  - BrowserPod
score: 80
hero_image: "./greencode.png"
---

## What is Greencode?

Greencode is a static analysis tool designed to audit Python code for carbon intensity and energy efficiency. By identifying inefficient algorithmic patterns, it helps developers reduce their software's carbon footprint and rewards optimization progress with Carbon Credits and a digital certificate.

The project was awarded the **Sustainability Award** at the 2026 AI in the Box Hackathon.

## What the demo includes

- **Energy Auditor**: Evaluates Python code against 30+ "Green Rules" covering computational complexity, memory thrashing, and database query loops.
- **Granular Energy Scoring**: Ranks code efficiency on a scale of 10 to 100, highlighting "Carbon Monster" segments that require optimization.
- **Actionable Refactoring**: Provides real-time code rewrite suggestions to help transform inefficient structures into "Green Master" code.
- **Digital Sustainability Ledger**: Tracks optimization progress and displays calculated carbon savings in a public dashboard.

## How it works

Greencode splits its execution between a React frontend and a Python auditor core running client-side inside a BrowserPod sandbox.

When a developer pastes code into the editor, the React frontend passes the code to the Python core executing inside the BrowserPod container. Using BrowserPod's in-browser Linux runtime, the python environment compiles the source code into an Abstract Syntax Tree (AST) using `auditor.py`, evaluates structural complexity using `scanner.py`, and outputs the energy score using `scorer.py`. Because all computation runs inside the local browser sandbox, sensitive source files never leave the developer's machine, ensuring absolute code privacy.
