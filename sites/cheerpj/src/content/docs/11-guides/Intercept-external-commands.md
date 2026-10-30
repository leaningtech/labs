---
title: Intercept external commands
description: How to intercept external system commands that are executed in a Java application
---

Java programs run external system commands with methods such as `Runtime.getRuntime().exec(command)` or `new ProcessBuilder(command)`. For example, a Java application might run a command to open a URL in the default browser, launch a script, or run a platform-specific utility. On the desktop, these commands start processes on the operating system.

In the browser, CheerpJ cannot start operating system processes. With the [`execCallback`] option of [`cheerpjInit`], CheerpJ passes these commands to a JavaScript function instead, so you can implement the same behaviour in JavaScript. Without it, the command is rejected.

## execCallback option

The [`execCallback`] option takes a function, which CheerpJ calls whenever the Java application runs an external command. CheerpJ passes the details of the command to the function, so it can implement the command's behaviour in JavaScript.

The function receives two parameters:

- `cmdPath`: the command that Java tried to run.
- `argsArray`: an array of the arguments passed to the command.

## Example walkthrough

This Java program opens a URL:

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

The program uses `Runtime.getRuntime().exec(command)` to open a URL in the default web browser on Linux, with the `xdg-open` command. On Windows, the equivalent command is `cmd /c start`.

The same behaviour can be implemented in JavaScript:

```js title="index.html"
function execCb(cmdPath, argsArray) {
	// Check for the xdg-open command
	if (cmdPath == "xdg-open") {
		// Open the URL in a new browser tab
		// argsArray[0] is "http://www.example.com" in this example
		window.open(argsArray[0], "_blank");
	}
}
```

The function checks whether the command is `xdg-open`. If it is, it opens the URL in a new browser tab with `window.open()`.

Pass this function to [`cheerpjInit`] with the [`execCallback`] option, so that CheerpJ calls it whenever the Java application runs an external command:

```js title="index.html"
function execCb(cmdPath, argsArray) {
	if (cmdPath == "xdg-open") {
		window.open(argsArray[0], "_blank");
	}
}

(async function () {
	await cheerpjInit({ execCallback: execCb });
	await cheerpjRunMain("Example", "/app/");
})();
```

The `Runtime.getRuntime().exec(command)` call in the Java application opens a new browser tab, implemented in JavaScript.

[`execCallback`]: /docs/reference/cheerpjInit#execcallback
[`cheerpjInit`]: /docs/reference/cheerpjInit
