---
title: Getting started
---

To get started with Cheerp, you'll first need to [install it](../installation). Or, you can try Cheerp without installing it with [Cheerp playground](https://cheerp.cppse.nl).

Cheerp in itself has no dependencies, but the recommended workflow and the tutorials make use of:

- a JavaScript engine (such as Node.js)
- an HTTP server (such as http-server)
- a web browser

If you don't have these, see [recommended workflow](getting-started/recommended-workflow). If you're not sure, make sure that the following commands work in your terminal:

1. `/opt/cheerp/bin/clang++ --version` (`C:\cheerp\bin\clang++ --version` on Windows systems)
2. `nodejs --version`
3. `http-server -o`

## Compiling your first application

You are now ready for compiling your first Web application using Cheerp.
Move to a folder of your choice and save the following C++ program as `hello.cpp`.

```cpp
// The cheerp/clientlib.h header contains declarations for the browser APIs
#include <cheerp/clientlib.h>

// webMain is the entry point for web applications written in Cheerp
void webMain()
{
        client::console.log("Hello, World Wide Web!");
}
```

You can then compile this program using the following command line:

```
/opt/cheerp/bin/clang++ -target cheerp hello.cpp -o hello.js
```

Great, you have compiled your first program with Cheerp. You can now run the generated JavaScript directly with

```
nodejs hello.js
```

You can also save this HTML file as `hello.html`:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Cheerp example 0: hello</title>
		<script defer src="hello.js"></script>
	</head>
	<body>
		<h1 id="pagetitle">
			Open the console log (Ctrl + Shift + J or Ctrl + Option + J) to read the
			output
		</h1>
	</body>
</html>
```

and from the same folder `firefox hello.html` (or equivalent).

This is what the result should look like: [hello.html](/cheerp/tutorials/hello_world/hello.html)

[Why `webMain()` instead of `main()`?](/cheerp/core-concepts#the-webmain-entry-point)

[What is `console.log()`?](/cheerp/core-concepts#what-is-clientconsolelog)

It would have compiled also with `std::cout<< `, `printf()` or `int main()` (try it yourself), but we wanted to show first what zero-overhead access to the browser looks like.
