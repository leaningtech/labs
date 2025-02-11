---
title: Intercept external commands
description: How to intercept external system commands that are executed in a Java application
---

When a Java program needs to execute an external system command, it often uses methods like `Runtime.getRuntime().exec(command)` or `ProcessBuilder(command)`. For example, a Java application might run a command to open a new browser window, launch a script, or execute a platform-specific utility. By default, these commands would execute directly on the system where the Java application runs.

With the [`execCallback`] [`cheerpjInit`] option, you can redirect those external commands to a JavaScript callback function. This allows you to control how commands are handled, enabling you to implement equivalent functionality in JavaScript.

> [!note] Important
> The `execCallback` option is supported in CheerpJ 3.1 and later versions.

## execCallback option

The [`execCallback`] option takes a function as a parameter, which will be called by CheerpJ whenever an external command is intercepted. CheerpJ automatically forwards all the necessary information about the intercepted command to this callback, allowing you to implement its behavior in JavaScript.

The JavaScript callback function accepts two parameters:

- `cmdPath`: The command that would have been executed in Java.
- `argsArray`: An array containing any additional arguments that were passed to the command.

These parameters provide all the context you need to handle the intercepted command.

## Example walkthrough

Let's walk through a simple example in Java:

```java title="Example.java"
import java.io.IOException;

public class Example
{
	public static void main(String[] a) throws IOException, InterruptedException
	{
		String url = "http://www.example.com";
		// The xdg-open command opens a URL in the default browser on Linux
		String command = "xdg-open " + url;
		Runtime.getRuntime().exec(command);
	}
}
```

In this example, the Java program uses `Runtime.getRuntime().exec(command)` to open a URL in the default web browser on a Linux system. The command `xdg-open` is typically used to launch a URL in the browser. On Windows, a similar behavior is achieved with the command `cmd /c start`.

We can now implement the same behavior in JavaScript, here’s how:

```ts title="Index.html"
function execCb(cmdPath, argsArray) {
	// Check for the xdg-open command
	if (cmdPath == "xdg-open") {
		// Open a new browser window
		// argsArray will be "http://www.example.com" in our case
		window.open(argsArray, "_blank");
	}
}
```

In this JavaScript function, we check if the incoming command is `xdg-open`. If it matches, we use `window.open()` to open a new browser tab with the specified URL.

We can now pass this function to [`cheerpjInit`] using the [`execCallback`] option. This ensures that the function is invoked whenever an external command is executed in Java.

```ts title="index.html"
function execCb(cmdPath, argsArray) {
	if (cmdPath == "xdg-open") {
		window.open(argsArray, "_blank");
	}
}

(async function () {
	await cheerpjInit({ execCallback: execCb });
	await cheerpjRunMain("/app/Example");
})();
```

By doing this, we successfully intercept the `Runtime.getRuntime().exec(command)` call from the Java application and implemented the same functionality using JavaScript to open a new browser window.

[`execCallback`]: /docs/reference/cheerpjInit#execcallback
[`cheerpjInit`]: /docs/reference/cheerpjInit
