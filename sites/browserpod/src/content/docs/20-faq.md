---
title: Frequently Asked Questions
---

## Who can use BrowserPod?

## What is BrowserPod's license?

## What are the differences between BrowserPod and WebContainers?

Both BrowserPod and WebContainers are technologies that enable running Node.js code in the Browser.

While the general architecture of the two product is similar, BrowserPod has a secret weapon: CheerpOS.
Like WASI, CheerpOS is a system interface that applications can target, but unlike WASI its goal is to provide the full Linux kernel APIs, and allow as much code as possible to compile for the Web without modifications.

BrowserPod allows a dev web server to be accessed transparently not only across tabs on the same browser, bu from anywhere in the world, using its [Portal](#what-is-a-portal) URL.

Another important difference is the licensing and pricing models. For example there is no restriction on the usage of BrowserPod as part of AI products.

## What is a Portal?

All listening HTTP sockets inside a Pod are associated with a Portal: a unique subdomain of browserportal.io that allows anyone to connect to the server from the Internet.
