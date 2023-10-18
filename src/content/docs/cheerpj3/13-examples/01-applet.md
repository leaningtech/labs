---
title: Pitch applet
---

In this tutorial you will learn how to run a Java applet in a modern browser by integrating CheerpJ within your page.

For this tutorial we will use the Pitch applet from NASA's [Beginner's Guide to Aeronautics](https://www.grc.nasa.gov/WWW/K-12/airplane/). This applet shows an interactive animation of an aircraft's pitch motion. [See more](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/aircraft-rotations/).

## Prerequisites

- [Download the template project](/cheerpj3/examples/applet-template.zip) and unzip it
- [Node.js](https://nodejs.org/en/) (>= 18)

The template project has the following structure:

```
.
├── index.html
├── Pitchview.class
├── Pitchview$Dispnl$Butpnl.class
├── Pitchview$Dispnl$Conpnl.class
├── Pitchview$Dispnl$Pic.class
├── Pitchview$Dispnl.class
└── images
    ├── pit1.gif
    ├── pit2.gif
    ├── pit3.gif
    ├── pit4.gif
    ├── pit5.gif
    ├── pit6.gif
    ├── pit7.gif
    ├── pit8.gif
    └── pit9.gif
```

## 1. Run a web server

To view the example, we need to host the files on a web server. [Vite](https://vitejs.dev/) is a convenient tool for this, as it automatically reloads the page when the files change.

```sh
npx vite
```

Alternatively you can also use the http-server utility.

```sh
npm install http-server
http-server -p 8080
```

Open a browser tab pointing to your localhost such as `http://127.0.0.1:8080/`.

## 2. Creating a classic HTML document

The provided template contains the final `index.html` file. You can delete its content and start it from scratch to follow the next steps.

A basic HTML file would look like this:

```html title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>

	<body></body>
</html>
```

## 3. Add your applet content

The next step is to add the applet tag with its parameters, just like they used to be integrated on web pages. We will also add some titles, descriptions and styles.

```html {24-31} title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Pitch applet (CheerpJ)</title>
	</head>
	<style>
		div {
			max-width: 500px;
			margin: auto;
			text-align: center;
		}
		h1 {
			margin-bottom: 50px;
		}
		h5 {
			margin-top: 20px;
		}
	</style>
	<body>
		<div>
			<h1>Applet example with CheerpJ</h1>
			<div>
				<applet
					archive="Pitchview.class"
					code="Pitchview.class"
					height="300"
					width="500"
				>
					Your browser cannot handle the applet tag!
				</applet>
			</div>
			<h5>
				The applet shown in this example belongs to the NASA's
				<a href="https://www.grc.nasa.gov/WWW/K-12/airplane/">
					Beginner's Guide to Aeronautics
				</a>
				and it is available at their
				<a href="https://github.com/nasa/BGA/tree/main"> GitHub repository </a>.
			</h5>
		</div>
	</body>
</html>
```

Go to your browser and refresh the page. You will see the titles and text you just added. As expected, the applet will not be on display, instead there is the message _**Your browser cannot handle the applet tag!**_

## 4. Integrating CheerpJ

Integrating CheerpJ in your page is as simple as adding a `<script>` with the CheerpJ loader url. This will be placed within the document's `<head>` tag. Next, we need to call `cheerpjInit()` in another script block.

Your document will look like this:

```html {6, 49-51} title="index.html"
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Pitch applet (CheerpJ)</title>
		<script src="https://cjrtnc.leaningtech.com/3.0rc1/cj3loader.js"></script>
	</head>
	<style>
		div {
			max-width: 500px;
			margin: auto;
			text-align: center;
		}
		h1 {
			margin-bottom: 50px;
		}
		h5 {
			margin-top: 20px;
		}
	</style>

	<body>
		<div>
			<h1>Applet example with CheerpJ</h1>
			<div>
				<applet
					archive="Pitchview.class"
					code="Pitchview.class"
					height="300"
					width="500"
				>
					Your browser cannot handle the applet tag!
				</applet>
			</div>
			<h5>
				The applet shown in this example belongs to the NASA's
				<a href="https://www.grc.nasa.gov/WWW/K-12/airplane/"
					>Beginner's Guide to Aeronautics</a
				>
				and it is available at their
				<a href="https://github.com/nasa/BGA/tree/main">GitHub repository</a>.
			</h5>
			<h5>
				Applet is running with
				<a href="https://labs.leaningtech.com/cheerpj3">CheerpJ</a> by
				<a href="https://leaningtech.com/">©Leaning Technologies</a>
			</h5>
		</div>
		<script type="module">
			await cheerpjInit();
		</script>
	</body>
</html>
```

Refresh your page and now you will be able to see your applet running!

> You can also replace the `applet` tag with `<cheerpj-applet>` to avoid potential conflicts with native Java

## The result

Your final page will look like this:

<iframe src="https://leaningtech.github.io/cheerpj-example-applet/" class="w-full aspect-square"></iframe>

## Source code

[Find the full source code in GitHub](https://github.com/leaningtech/cheerpj-example-applet)

## Credits

The applet used for this tutorial belongs to the NASA's [Beginner's Guide to Aeronautics](https://www.grc.nasa.gov/WWW/K-12/airplane/) and it is available at their [GitHub repository](https://github.com/nasa/BGA/tree/main).

## Further reading

To continue learning about CheerpJ, visit the [reference](/cheerpj3/reference).
