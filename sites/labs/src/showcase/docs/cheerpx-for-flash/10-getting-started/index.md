---
title: Getting started
---

This page will help you get started with CheerpX for Flash and give you a brief insight into how to run Flash content in a normal modern browser.

## Prerequisites

To start, you need to have joined the Enterprise Evaluation Programme (EEP), or purchased a license for CheerpX to receive our releases. You should receive these via email each time we have a new release. If you want to enquire about the EEP feel free to [contact us](https://leaningtech.com/contact-us).

You also need to make sure you have agreed to Adobe's free evaluation license, and received your custom build of `libHCSFP_CX.so` from Adobe/Harman. Feel free to get in touch with Harman, tell them that you're planning to use CheerpX, and ask them for the `libHCSFP_CX.so` file. They will provide you with a build to use alongside CheerpX.

Make sure you have downloaded the latest CheerpX release, and unzipped this. The contents of the zip should look like this:

<p align="center"><img src="https://leaningtech.com/wp-content/uploads/2021/04/cheerpx_contents.png" width="700"></p>

Open the `ppfp/` folder and drop the `libHCSFP_CX.so` file into there.

You now have CheerpX ready to be installed on a HTTP server!

## Installing CheerpX for Flash

This part of the installation procedure may have some discrepancy, depending on your method of serving CheerpX for Flash.

CheerpX for Flash can be served via any major HTTP server or CDN, so as long as you are able to provide the files to a client machine over HTTP(S), you can host CheerpX for Flash.

Simply configure a server of your choice, and place the CheerpX directory into it, along with the lib file that we placed in `ppfp/`.

Double check your server is correctly serving the files before proceeding.

We tend to find that with most major hosting methods, this is sufficient, but in certain scenario's, additional steps have to be taken to correctly configure the HTTP server. We have detailed some of these common problems on our [troubleshooting](/cheerpx-for-flash/troubleshooting) page.

## How to integrate CheerpX for Flash

In most scenarios, our customers are able to add some simple Javascript to the HTML page that is embedding the flash content. The process is extremely straightforward, and involves two simple steps:

1. Include the `pp.js` script that we are hosting on our HTTP server:

```html
<script src="https://mydomain.com/cheerpx/pp.js"></script>
```

2. Call the `ppInit()` function to initialise CheerpX for Flash:

```html
<script>
	window.onload = (event) => {
		ppInit();
	};
</script>
```

Here, we are calling the init function once the window finishes loading, although it is up to your discretion to decide the best way to initialize CheerpX in your own environment.

And that's it! As long as the user is accessing the page from a WebAssembly-enabled browser, they should now experience seamless Flash content, close to the experience before the end-of-life of Flash.

---

In some scenarios, a customer cannot edit the HTML of the page directly. If this is your case, we can offer one other workaround, which involves configuring and installing a custom [chrome extension](/cheerpx-for-flash/extension). This extension does not contain CheerpX for Flash, it simply dynamically adds the same JavaScript outlined above, as soon as a user navigates to the page.

## Basic HTML page for testing

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>CheerpX - Flash Demo</title>
		<script src="https://mydomain.com/cheerpx/pp.js"></script>
		<script>
			window.onload = (event) => {
				ppInit();
			};
		</script>
	</head>

	<body>
		<embed src="./my_flash_content.swf" width="700" height="700" />
	</body>
</html>
```

This page will initialize the CheerpX system when the page is loaded. It will detect and run the flash content seamlessly on the client machine.

You simply need to change the script src on line 5 to your HTTP server that is running CheerpX, and change the embed tag to point to your flash content.

Other methods of embedding flash content are supported (e.g. SWFObject, object etc.).

You can now serve this web page on a simple http server - this could be the same server that is hosting CheerpX or somewhere entirely different.

---

Take a look at our dedicated [troubleshooting page](/cheerpx-for-flash/troubleshooting) for a more detailed overview of how to troubleshoot any issues you may encounter.

For further information on setting up and configuring CheerpX for Flash, take a look at [our tutorial](/cheerpx-for-flash/getting-started/tutorial).

For further information on how things work, and the infrastructure requried to run CheerpX for Flash, take a look at [how it works](/cheerpx-for-flash/how).
