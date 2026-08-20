---
title: Run programs in a Pod
description: Create a terminal and run programs inside a Pod
---

This guide will show you how to add interactive terminals on your page.

_This guide assumes you have a Pod running already. Take a look at our [Quickstart](/docs/getting-started/quickstart) and [npm project setup guide](/docs/getting-started/expressjs) to learn more._

## Create a terminal

### 1. Add an HTML element on your page

A terminal needs an element in your page to render into. Add the following element to the HTML of the relevant page:

```html
<div id="console"></div>
```

### 2. Starting the terminal

Then add the following line of JavaScript:

```js
const terminal = await pod.createDefaultTerminal(
	document.getElementById("console")
);
```

(_If using one of the templates, you would add this to `src/main.js`_)

_If you'd like to customize such as changing the size or invoking a specific callback, you can call [createCustomTerminal](/docs/reference/browserpod/createCustomTerminal) instead._

That's it! You now have a terminal on your page. On its own it's just a display; the next section covers how to run programs in it.

## Using the terminal

There are two ways to use it: run an interactive shell, or run programs directly.

### Run an interactive shell

Running `bash` with no arguments gives you an interactive shell in the
terminal, which is useful while developing:

```js
await pod.run("bash", [], { terminal });
```

### Run a program

If you prefer to run programs/terminal commands without manually inputting them, you can use [pod.run](/docs/reference/browserpod/run).

You pass pod.run the program, its arguments, and an options object that contains:

- `terminal`: Which terminal the program runs in.
- `cwd`: the working directory to run in
- `echo`: prints the command itself to the terminal before running it

For example, if you'd want to run Node:

```js
await pod.run("node", ["main.js"], {
	echo: true,
	terminal,
	cwd: "/project",
});
```

Pods come with programs like node, git, and bash already installed, but you can also run your own. Once you've
[copied a binary into the Pod](/docs/guides/write-files-to-pod), run it by
path like anything else:

```js
await pod.run("/project/hello", [], { terminal, cwd: "/project" });
```

The binary has to be compiled for BrowserPod's platform, a program built
for your own machine won't run in a Pod. See
[Installing the Rust toolchain](/docs/guides/installing-rust-toolchain) for an example of producing one.
