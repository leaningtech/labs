---
title: Licensing
description: "BrowserPod is free for any use under the BrowserPod Community Licence, with attribution. Edge plans for networking; Edge Pro includes a commercial licence to use BrowserPod without attribution; Enterprise for self-hosting."
---

BrowserPod is **free for any use**, including commercial use by companies of any size, under the [BrowserPod Community Licence](https://browserpod.io/license). The one condition is **attribution**. You don't need an account, an API key or a plan to use it.

What you can pay for is optional: **BrowserPod Edge**, the network service, and **Enterprise** licences for self-hosting and redistribution.

| | Community | Edge Free | Edge Pro | Enterprise |
| --- | --- | --- | --- | --- |
| Use of BrowserPod | Any use | Any use | Any use | Any use |
| Attribution | Required | Required | **Not required** (commercial licence included) | As agreed |
| Account | None | Console | Console | Console and contract |
| Edge networking | No | 1,000 connected hours a month | 2,000 hours a month, then $0.01 per hour | Custom, or self-hosted |
| Self-hosting, vendoring, redistribution | No | No | No | Yes |
| Price | Free | Free | $20 / month | Quoted |

## The Community Licence

The [BrowserPod Community Licence](https://browserpod.io/license) lets you use BrowserPod for development, evaluation and AI agents, and in production: in commercial products, internal tools, SaaS, open-source projects, documentation and education.

The conditions are:

- **Attribution.** Show a visible "Powered by BrowserPod" credit, linking to `https://browserpod.io`, on the page or screen that hosts the Pod: for example in its loading state, footer or About page. Agents and tools that use Pods without a user interface credit BrowserPod in their documentation or README. The runtime also prints a short notice in the browser console when it boots.
- **Load BrowserPod from our CDN.** The runtime and disk images are served from `rt.browserpod.io` and `disks.browserpod.io`. Don't copy the runtime files into your own build, mirror or re-host them, or redistribute them; that needs an Enterprise licence.
- **No reverse engineering, no warranty.** Support is through the community.

The licence is the text at [browserpod.io/license](https://browserpod.io/license); this page summarises it.

### Runtime versions are permanent

Each published runtime version is immutable and stays available, so an application pinned to a version keeps working. The only exception is a version with a critical security flaw, which may be withdrawn or blocked, with an upgrade path to a fixed version.

### Which versions does the licence cover?

From 13 November 2026, the Community Licence covers every runtime version served from our CDN, including 3.x. Versions **earlier than 3.5.0** can't boot without an API key, so using them also means using Edge, with an account and the [Edge Terms of Service](https://browserpod.io/terms). Earlier licence texts stay available in the [legal history](https://browserpod.io/legal).

## BrowserPod Edge

[Edge](/docs/understanding-browserpod/networking) is the optional network service. A Pod uses it only if you boot it on an edge network with an API key from the [BrowserPod console](https://console.browserpod.io). Edge gives Pods:

- **Portals**, public URLs to servers running in the Pod;
- **outbound networking** for socket-level clients such as git, npm and curl, and **TCP** to allowed domains;
- **controlled egress**: a default allowlist of reachable domains, or custom allowlists on Edge Pro.

Only Edge is metered: **10 tokens ($0.01) per connected Pod-hour**. Edge is charged in one-hour blocks of 10 tokens ($0.01): one block when the Pod connects, and another for each further hour, or part of an hour, that it stays connected. Compute runs in your users' browsers and is never metered.

- **Edge Free**: 10,000 tokens a month (up to 1,000 connected hours), the default allowlist, up to 5 API keys in total, with one origin each.
- **Edge Pro**, $20 a month: 20,000 tokens (up to 2,000 connected hours), then $0.01 per extra hour; token top-ups; custom allowlists; unlimited keys and origins; and **a commercial licence to use BrowserPod without attribution**.

The [Pricing Policy](https://browserpod.io/pricing-policy) and [Edge Terms of Service](https://browserpod.io/terms) have the details. Open-source projects and startups can apply for [Edge grants](https://browserpod.io/pricing#grants).

## Enterprise

An Enterprise licence covers what the Community Licence doesn't:

- **Self-hosting** the runtime and disk images on your own servers or CDN, or **vendoring** them into your build;
- **self-hosted Edge**, with your own network policy, logs and domain;
- **redistribution / OEM**, shipping BrowserPod inside your product to your customers;
- a commercial licence to use BrowserPod without attribution, SSO, SLAs and a dedicated solutions engineer.

[Contact us](https://browserpod.io/contact) for a quote.

## Privacy

When your page loads BrowserPod, your users' browsers download the runtime and disk images from our CDN. The [Runtime Privacy Policy](https://browserpod.io/runtime-privacy) describes what that involves; [Privacy for integrators](/docs/more/privacy-for-integrators) explains what to say in your own privacy policy.

## Support

If you have questions, contact support at `support@leaningtech.com`.
