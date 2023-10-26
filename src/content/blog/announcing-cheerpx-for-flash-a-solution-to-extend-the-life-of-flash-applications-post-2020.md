---
title: "Announcing CheerpX for Flash, a solution to extend the life of Flash applications post-2020"
description: |
  Today we are proud to announce CheerpX for Flash, a solution to run existing Flash applications on any browser after December 2020.
pubDate: "2020-09-21"
categories:
  - "technical-blog"
  - "webvm"
authors:
  - stefano
heroImage: ./flash-to-html5.webp
---

Today we are proud to announce CheerpX for Flash , a solution to run existing Flash applications on any browser after December 2020.

CheerpX for Flash will allow organisations to extend the life of any Flash-based application, including Flex, Spark and OpenLaszlo applications, by using an ‘emulated’ (virtualised) version of the Adobe Flash Player, that can be used post-2020.

CheerpX for Flash is a solution that primarily targets the Enterprise sector, in urgent need to extend the life of complex existing Flash applications, particularly those based on Flex. In addition, public sector and not-for-profit organisations, as well as companies and institutions active in Education, will be able to benefit from CheerpX for Flash.

An exclusive partnership with a HTML5 video game distribution platform, that will be announced before the end of the year, will make CheerpX for Flash also available for gaming distributors and publishers.

### Background

At Leaning Technologies, we make software development tools that target HTML5, i.e. the browser as a platform.

Starting in 2013, we have developed several compile-to-WebAssembly and compile-to-JavaScript solutions, allowing one to compile C/C++ ([Cheerp](/cheerp)) and Java ([CheerpJ](/cheerpj)) to HTML5.

Since its inception, we have been working extensively with WebAssembly, that is now used by both of our compilers. From 2019, WebAssembly has become a very powerful and popular target platform, primarily for ahead-of-time compilation, for a number of languages, including C/C++, Rust, C#, Haskell, Go, and many others.

In late 2018, we started working on what we believed was a missing piece of software development tools for the HTML5/WebAssembly platform — an x86 virtual machine, primarily aimed at Linux executables — in WebAssembly.

This technology, which we named CheerpX, would allow running Linux binaries in-browser, *without needing to re-compile them to WebAssembly from source*, via an x86 to WebAssembly binary translation JIT engine. More detail on CheerpX is available on [our website](/pages/cheerpx.html).

In essence, CheerpX transparently creates a local HTML5 virtual machine on the browser, that can be used to run any unmodified executable without recompilation to WebAssembly.

Work on CheerpX is still ongoing, and the tool is not released at present.

### CheerpX for Flash

[CheerpX for Flash](/cheerpx/for-flash) is a special embodiment of [CheerpX](/cheerpx), a WebAssembly virtualization solution to run Linux executables in-browser.

CheerpX for Flash uses the CheerpX technology to run an ‘emulated’ (virtualized) version of the Adobe Flash Player, without having to install it on the client browser, and therefore compatibly with the deprecation of Flash post-2020.

By adding CheerpX for Flash to any Flash page, the page is ‘transformed’ to HTML5, making it compatible with any browser without the Flash Player. CheerpX for Flash is a pure HTML5 solution, made of JavaScript, WebAssembly and HTML/CSS, that does not require any back-end other than an HTTP server.

Being based on the Adobe Flash Player, CheerpX for Flash is compatible with any Flash application, or technology that targets the Flash platform, including frameworks such as Flex and Spark, or OpenLaszlo.

### Integrating CheerpX for Flash

![](./images/1_VAxttqkhbYn-s17Ij7MoYQ-300x136.png)

CheerpX for Flash is easily integrated on any existing HTML page that embeds Flash via the `<embed>`, `<object>` tags or `swfobject.js` library.

CheerpX for Flash is a collection of static assets (HTML, JavaScript, WebAssembly and CSS) that can be hosted on any HTTP server, including CDNs.

All of CheerpX for Flash assets are cacheable, and amount to a total download size of ~7 MB. Any number of HTML pages with Flash can point to the same CheerpX for Flash installation.

An alternative integration method via a custom extension for Chrome and Microsoft Edge will be available for any organisation without direct control over the backend, or whenever modifying the source .html files is inconvenient.

### Deployment of CheerpX for Flash

CheerpX will be available as either cloud software or for self-hosting.

The cloud version of CheerpX for Flash will be hosted on Leaning Technologies servers, backed by an enterprise-grade worldwide CDN for minimal latency, higher download speed and uptime guarantees. No limitations to bandwidth and no logging whatsoever will be enforced. We have been using this deployment method for our Java to HTML5 tool [CheerpJ](/cheerpj) for several years, having currently an average of ~600,000 unique users per month, with no downtime ever recorded to date.

CheerpX for Flash will also be made available for self-hosting. Self-hosting will be allowed on public and private clouds, as well as on private networks, air-gapped environments, and on-premise installations.

The requirements for self-hosting are minimal. CheerpX for Flash is compatible with virtually any HTTP server. There is no active backend component to CheerpX.

### Licensing

CheerpX for Flash is an Enterprise solution for the preservation of existing Flash applications, based on the Adobe Flash Player. A commercial licence is required for any use of CheerpX for Flash.

Licences for the cloud-hosted version of CheerpX for Flash are organisation-wide, with pricing not based on the number of users, number of applications, or number of requests made to the cloud deployment.

For organisations interested in self-hosting CheerpX for Flash, a redistribution licence for the Flash Player also needs to be procured from [Harman](https://services.harman.com/partners/adobe) . Leaning Technologies can make the right introductions and facilitate the conversation with Harman.

Special discounts for the educational sector and not-for-profits are being negotiated and should be available in time for general availability.

An exclusive partnership has been negotiated with a leading HTML5 game distribution platform, which will make CheerpX for Flash available to any video game publisher, distributor, and creator. A dedicated announcement will be made by our partner in due course.

### Examples

CheerpX for Flash has been successfully tested on a vast number of AS2 and AS3 Flash applications, and on Flex (multiple releases), Spark and OpenLaszlo applications.

A few examples of Flash and Flex applications running with CheerpX for Flash are available on [our website](https://leaningtech.com/pages/cheerpxflash.html). We will be adding more in the next days.

### Availability

Since January, we have been working with Early Adopters testing beta builds of CheerpX for Flash, including several Fortune 500 and NASDAQ companies in sectors including telecommunications, cybersecurity, defence, healthcare, IT consulting, education, digital media, banking & finance, media & entertainment, aviation & transport, and logistics.

General availability of CheerpX for Flash is planned for 15 October.

An Enterprise Evaluation Programme is now available for organisations interested in exploring CheerpX for Flash with the assistance of our technical team. If you would like to find out more about our Enterprise Evaluation Programme, please get in touch with [sales@leaningtech.com](mailto:sales@leaningtech.com) .

### For Partners

We are also welcoming new partnerships with IT, Consultancy and third-party support firms to join our [Partner Program](/partner-programs/) for exclusive support to our line of bespoke tools to extend the life of legacy Flash & Java applications and our specialist expertise in WebAssembly.

If you would like to find out more about our Partner Program, please get in touch with [sales@leaningtech.com](mailto:sales@leaningtech.com).
