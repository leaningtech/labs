---
title: Creating and using Terminals in the pod
description: Create a terminal and run programs inside a Pod
---

This guide will show you how to add interactive terminals on your page.

_This guide assumes you have a pod running already, see our [Quickstart](/docs/getting-started/quickstart) or [NPM project setup guide](/docs/getting-started/expressjs)_ to see how.

## Create a terminal

### 1. Add an html element on your page.

A terminal needs an element in your page to render into, add the following element to the html of the relavent page:

```html
<div id="console"></div>
```

### 2. Starting the terminal

Then add the folowing line of javascript:

```js
const terminal = await pod.createDefaultTerminal(
	document.getElementById("console")
);
```

(_If using on of the templates, you would add this to src/main.js_)

_If you'd like to customize your terminal, such as changing the size, or invoke a specific callback on terminal output, you can call [createcustomterminal](/docs/reference/BrowserPod/createCustomTerminal) instead._

that's it! You now have a terminal, on your page. Keep reading to see how to use it:

## Using the Terminal

Terminal usage can be split in 2 ways, interactive terminal usage, and running programs from the pod.

--- WIP (or.. more WIP then above ig haha) from here---

### 1. Run an interactive shell

Running `bash` with no arguments gives you an interactive shell in the
terminal, which is useful while developing:

````js
await pod.run("bash", [], { terminal });


## Run a program

Pass the program, its arguments, and the terminal to run it in:

```js
await pod.run("node", ["main.js"], {
  echo: true,
  terminal,
  cwd: "/project",
});
````

- `echo` prints the command itself to the terminal before it runs
- `cwd` sets the working directory
- `terminal` is where the program's output goes

````

## Run a binary you've copied in

Programs don't have to come from the system image. Once you've
[copied a binary into the Pod](/docs/guides/write-files-to-pod), run it by
path like anything else:

```js
await pod.run("/project/hello", [], { terminal, cwd: "/project" });
````

The binary has to be compiled for BrowserPod's platform — a program built
for your own machine won't run in a Pod. See
[Installing the Rust toolchain]() for an example of producing one.
