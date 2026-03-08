---
title: HomeByMe
description: A home design application, compiled to the web with Cheerp
demo_url:  https://home.by.me/en/
author: HomeByMe, Leaning Technologies
project_type: Enterprise Demo
niche: Interior Designm
tags:
  - Cheerp
hero_image: "./homebyme.png"
---

HomeByMe is an online 3D space planning service developed by Dassault Systèmes SE, and powered by Cheerp.

HomeByMe allows users to design, visualise, and review home and furniture layouts, using intuitive 3D views to allow consumers to easily create detailed floor plans, test various furniture, play with thousands of decoration elements, and experience a virtual immersion into their home. HomeByMe is enjoyed by users worldwide, who have shared over 1.5 million floor plans and interior design ideas with home builders, kitchen retailers, architects, friends, and family.

HomeByMe is primarily written in C++, and its large multi-target codebase was developed over a decade by a team of developers and offered until 2015 as a set of native applications for Desktop and Mobile. With an interest in exploring modern HTML5 web technologies to deliver a browser-based version of their application, and after research and consideration of alternative options, 3DVIA engaged with Leaning Technologies to explore the viability of compiling their multi-target C++ codebase to JavaScript (and later WebAssembly).

Cheerp was introduced in the HomeByMe toolchain in 2015, when Dassault Systèmes started collaborating with Leaning Technologies in the porting of HomeByMe. In the course of a few months of work, their very large application was fully converted and functional in HTML5/JavaScript, and we could put our combined attention to performance and size optimisations. Since then, Cheerp has been used in production to convert all the logic of the application, which has been kept fully in C++, with a new frontend integration written in HTML5/JavaScript.
