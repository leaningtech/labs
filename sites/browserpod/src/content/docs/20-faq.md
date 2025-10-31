---
title: Frequently Asked Questions
---

## Who can use BrowserPod?

## What is BrowserPod's license?

## What are the differences between BrowserPod and WebContainers?
Both BrowserPod and WebContainers are technologies that enable running Node.js code in the Browser.

WebContainers also supports running WASI applications, and ships a build of `python`, and a handful of utility programs like `jq`.
BrowserPod, while initially focusing on Node.js, will soon add support support for Python and Ruby, and we plan to include useful program like git and curl.

While the general architecture of the two product is similar, BrowserPod has a secret weapon: CheerpOS.
Like WASI, CheerpOS is a system interface that applications can target, but unlike WASI its goal is to provide the full Linux kernel APIs, and allow as much code as possible to compile for the Web without modifications.

BrowserPod allows a local web server to be accessed from different tabs on the same browser without the need to change Browser settings. The server can actually be accessed from anywhere in the World by sharing its Portal URL.

Another important difference is the licensing and pricing models. For example there is no restriction on the usage of BrowserPod as part of AI products.

## What is a Portal?
All listening HTTP sockets inside a Pod are associated with a Portal: a unique subdomain of browserpod.io that allows anyone to connect to the server from the Internet.
Clodflare Workers are used to proxy the traffic and serve it over HTTPS to the Internet.
