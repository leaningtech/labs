---
title: CheerpJ Applet Runner
subtitle: Run Java applets in Chrome and Edge with this browser extension
---

The CheerpJ Applet Runner is a browser extension/add-on that enables Java applets without requiring a local Java installation or to install deprecated plugins. CheerpJ Applet Runner is available as:

- Google Chrome Extension at <https://chrome.google.com/webstore/detail/cheerpj-applet-runner/bbmolahhldcbngedljfadjlognfaaein> 
- Microsoft Edge Add-On at <https://microsoftedge.microsoft.com/addons/detail/cheerpj-applet-runner/ebfcpaoldmijengghefpohddmfpndmic>

Note that both versions are upgraded to release of 2.2 of [CheerpJ](https://leaningtech.com/cheerpj/).

Since Java Applets have lost support on the majority of browsers, a tremendous amount of content, particularly in science and education, is virtually inaccessible. We aim at solving this problem by providing a solution to extend the life of Java applets on modern browsers.

What is the CheerpJ Applet Runner?
-------
<p align="center"><img src="media/cheerpj_applet_demo1.gif" width="400"></p>

The CheerpJ Applet Runner works by converting the Java Applet on the fly through CheerpJ, a minimal Java-bytecode-to-JavaScript compiler, directly on the browser, and linking it to the CheerpJ runtime environment.

Main project link: <https://leaningtech.com/cheerpj-applet-runner/>

Please note that CheerpJ Applet Runner extension is self packaged, meaning all needed assets will be downloaded at installation/update time. Usage of the CheerpJ Applet Runner will then only ever require users to download the actual applet content.

Using the CheerpJ Applet Runner
-------

Please feel free to try the extension on any applet you like. Here are a few examples:
* <http://sab-steveabaker.com/alpine/alpine.html>
* <http://sab-steveabaker.com/sabgolf/golf.html>
* <http://www.neilwallis.com/projects/java/water/index.php>
* <http://www.javaonthebrain.com/java/iceblox/>
* <http://www.schubart.net/rc/>


Bugs and Questions
-------
 
We welcome any feedback and bug report, either through the Extension/Add-On itself (click on icon + "Report bug") or on [GitHub](https://github.com/leaningtech/cheerpj-appletrunner/issues).
 
We aim at supporting as many Java applets as possible, and eventually Java WebStart applications.

## How does CheerpJ Applet Runner work?

The CheerpJ Applet Enabler Extension works by converting the Java Applet on the fly through CheerpJ.js, a minimal Java-bytecode-to-JavaScript compiler, and linking it to the CheerpJ runtime environment.

The compiler runs directly on your browser and doesn't transmit your applet or the URL you are visiting to any external server.

The CheerpJ Applet Runner is not a plugin, and therefore does not pose any security threat, unlike the Java plugin.

## Is any information sent to the cloud by the CheerpJ Applet Runner?

No, 100% of code execution is happening locally on the JavaScript engine of your browser. We do not collect information on the web pages
you are visiting, or any logs from the extension. 

## Can I report applets that are not working?

We encourage everybody to file a bug report either through the extension, or as a [GitHub Issue](https://github.com/leaningtech/cheerpj-appletrunner/issues).

## Is the CheerpJ Applet Runner free?

The CheerpJ Applet Runner can be used freely with no restriction on any publicly available, free Java applet.

If you want to use the CheerpJ Applet Runner within a private network, or for other commercial purposes, please get in touch with us at sales@leaningtech.com
