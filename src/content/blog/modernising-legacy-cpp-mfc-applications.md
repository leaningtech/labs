---
title: "Modernising Legacy C++ MFC Applications with Cheerp"
description: |
  Modernising C++/MFC applications into modern web applications can offer significant practical advantages and enable improved efficiency, productivity and flexibility. WebAssembly, and the Cheerp C++ to Wasm compiler offer a uniquely efficient path to achieve this, by preserving the vast majority of existing source code.
pubDate: "2024-06-20"
authors:
  - guest-martin
heroImage: ./mfc.png # TODO
tags:
  - Cheerp
---

As the software landscape evolves over time, businesses have the challenging task of "keeping up with the times". Advancements in tooling, platforms, frameworks and languages bring with them superior developer and user experience, improve maintainability and scalability, provide greater flexibility and enable innovation.

However, having made (often substantial) investments into existing internal or external applications based on no-longer-current technology stacks, businesses are often faced with the practical challenge of modernising application architecture or risk losing competitive advantage.

One such investment is into Windows **Microsoft Foundation Classes (MFC)**, a C++ framework for developing native desktop applications on Windows. First introduced in 1992, it was a popular choice for enterprise desktop applications for nearly two decades, offering a well featured toolkit for relatively complex desktop UI.

However, the framework has since fallen substantially behind state-of-the-art, and businesses have adopted more modern alternatives for desktop (such as .NET) or modern web applications, which offer greater capabilities, a better developer and user experience and improved maintainability.

The last major version update to MFC was in 2015, with no major future improvements planned. This leaves businesses with critical MFC applications facing the increasing risk and maintenance burden of a legacy application framework.


### Why consider modernisation?

Choosing to modernise an existing C++ MFC application can make a substantial difference to the maintainability and scalability of an application and to the efficiency and flexibility of its surrounding operations.

Legacy systems tend to have a higher risk and cost associated with changes or enhancements, slow and complex deployment, installation and configuration schemes, and fragile supporting infrastructure. This overhead acts as a drag on innovation, hampering the agility of the business.

Adopting a more modern approach can significantly lower the associated operating and maintenance burden, and improve the risk profile of the organisation's IT infrastructure. 

A well planned modernisation effort also provides an opportunity to improve a dated user experience to meet modern expectations from the user base, and generally offer improved usability and productivity. This includes increasing the accessibility of the target application to more platforms and devices.

Ultimately, the principal motivation for application modernisation is to achieve a flexible, user-friendly, scalable architecture that aligns your application stack with business goals. 


### Why target a web application?

The web, specifically, is a perfect target for modernisation efforts. 

By nature, web-based applications can be served instantly across a wide range of devices (mobile, tablet, desktop), without requiring explicit installation. Updates can be delivered automatically without any overhead or extra steps by end users. Modern web platforms have accessibility built into the standards, allowing applications to easily be made accessible to the widest audience possible.

Technologically, browsers have evolved into a ubiquitous application platform that is more capable of supporting complex applications than ever before, with sophisticated graphical, audio and 3D web applications now being commonplace. Cutting edge experimental web APIs such as Web Bluetooth and USB are aiming to extend the domain of web applications even further, clearly establishing a trajectory of continued dominance over native applications.

Aside from - or perhaps _because of_ - the platform's capabilities, modern users are spending more time than ever before on web browsers and have become accustomed to web based experiences as an expected standard. Modernising a legacy desktop application into a user-friendly web application can provide an opportunity to upgrade a legacy user experience to one that meets users where they are, improving their overall productivity.

Together, these effects directly translate into measurable impact in productivity and efficiency, making the web an excellent choice for business applications.


### Approaching a C++ MFC modernisation project

The return on investment is clear: bringing a C++ MFC application to the web delivers tangible value to its users and the business' bottom line. However, the prospect of modernising a complex, business-critical codebase is often a daunting one, where the available technical options might seem fraught with risk.

The traditional approach is to rewrite the application from scratch using modern web technologies and frameworks - an infamously difficult and risk prone proposition. Long lived legacy codebases are often notoriously complex as a result of their longevity. Replicating their behaviour exactly in a different language and targeting a different platform (the browser) is extremely tricky and time consuming, even for the most talented engineers. In addition, older applications often lack automated tests that can be reused to verify the behaviour of the new one. These applications will usually have subtle behaviour that is undocumented in existing specifications, further increasing the challenge of replicating behaviour consistency.

These are the factors that have given rewrites their infamous reputation. Completing them successfully on complex applications is bound, in the vast majority of cases, to take much longer and cost much more than expected, and often be altogether unsuccessful.

Thanks to the advent of WebAssembly (yet another major advancement in the web ecosystem) there is another way: **compiling the original (minimally modified) C++ code to run in the browser.**


### Leveraging WebAssembly & Cheerp: An order-of-magnitude improvement

WebAssembly - a web-native low level bytecode for the browser - enables near-native execution of code compiled from other programming languages (such as C++) on the browser. The technology was standardised in 2019, and its implications for modernisation projects are far reaching.

WebAssembly offers a far less risky option for re-architecting legacy applications that is particularly effective for C++/MFC applications. The original C++ source code can be compiled, with minimal modification, into Wasm code and executed on the browser, **saving the vast majority of effort involved in a full rewrite**. Behaviour consistency can be achieved with no added cost, as the same source code is guaranteed to have the same logical behaviour on the new platform.

Cheerp - an advanced C++ to Wasm compiler - makes this effort especially seamless, by providing straightforward inter-operation between the ported C++ code and the web platform. 


### Technical approach

At a high level, the technical approach involves three steps:

1. **Developing a new web-native user interface, using modern JavaScript web technologies (React, Angular, Vue, Svelte, etc.).**  This delivers a new up-to-date user experience to the application's end users.
2. **Isolate key business logic from the C++ MFC Application, and compile that to Wasm using Cheerp.** This preserves all the essential behaviour of the original application, and ensures that the new application will be functionally equivalent. 
3. **Integrate the compiled Wasm binary with the JavaScript UI and web APIs**, leveraging Cheerp's advanced JavaScript interop capabilities

![](./mfc-diagram.png)

This approach results in a modernised user interface that substantially improves the user experience, while maintaining the core behaviour of the original application. 

Rather than rewrite the full application from scratch, only a new user interface is developed, an effort which is both far less complex, and delivers value in its own right. Porting existing business logic to run on a new platform is also far simpler than fully re-writing the full application, as it requires only minor modifications to the existing source code.

In addition to faster delivery, this approach has the auxiliary benefits of maintaining existing expertise and application-specific knowledge of the application, and giving access to the large open-source ecosystem of C++ libraries. This means that future extensions to the application become easier to deliver, and existing team skills continue to be relevant for the new application infrastructure.

Overall, this approach sustainably delivers all the benefits of a modern application architecture, on a significantly shorter time-scale than a traditional rewrite project.


### Case study

This is the approach that DRS Software, in collaboration with Leaning Technologies, proposed and executed for our client, a major multi-national medical technology company specialising in the development, manufacturing, and distribution of medical equipment, reagents and consumables. The business relied on a critical C++ MFC application for configuration, pricing and quotation (CPQ) of complex deals valued at over € 9B annually.

The application was clearly showing its age, suffering from the complex maintenance and operational implications that come with maintaining and distributing a 20+ year-old legacy desktop application across all internal sales end users in 20+ countries worldwide.

Faced with the complex prospect of modernising a critical piece of their sales IT infrastructure, the business initiated a phased multi-year in-house rewrite effort to redesign the application as an AngularJS web application, re-implementing all the complex business logic in typescript. Not unexpectedly, this project faced significant challenges, with the complexity of the technical effort resulting in delays and budgetary overshoots.

Through a dedicated intervention project, we proposed, prototyped and delivered a WebAssembly port of the original MFC application, while retaining and the originally planned UI redesign. The result? a refreshed, modern web application released to production across the worldwide user base in under 12 months - less than a third of the originally proposed timeline, and at a substantially lower budget.


### Summary

Modernising C++/MFC applications into modern web applications can offer significant practical advantages and enable improved efficiency, productivity and flexibility. WebAssembly, and the Cheerp C++ to Wasm compiler offer a uniquely efficient path to achieve this, by preserving the vast majority of existing source code. This approach delivers on the benefits of a modern application architecture at a cost far lower than that of a full rewrite, allowing businesses to maintain their competitive advantage without spending a fortune.
