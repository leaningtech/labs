---
title: Frequently Asked Questions
---

The questions developers and organisations ask most often about CheerpJ, grouped by topic: what it is and which product to use, building with it, Oracle Forms and EBS, the browser extensions, compatibility, files and networking, performance, deployment, security, troubleshooting and licensing.

## General

### What is CheerpJ?

CheerpJ is a complete Java runtime for the browser, built from OpenJDK and compiled to WebAssembly. It runs Java client-side in Chrome, Edge, Firefox and Safari, with no plug-in, no Java installation and no server-side JVM. Use it to build web applications in Java, to bring Java desktop applications and applets online, and to use any Java library from JavaScript.

### Why should I use CheerpJ?

Because it runs real Java in the browser, from the JARs you already have:

- **If you build Java software**, you can offer a web edition of your product from the same codebase, on current Java versions, without a rewrite or a server per user.
- **If you build web applications**, you can use Java libraries client-side, from JavaScript.
- **If your organisation runs Java applications**, such as Oracle Forms, applets or Java Web Start, they run in a modern browser, without Internet Explorer mode, a Java installation on every desktop, or a remote desktop session.

### Is CheerpJ only for legacy applications?

No. CheerpJ supports Java 8, 11, 17 and 21, with Java 25 in preview, and adds each new Java LTS release. Software vendors use it to ship current Java products on the web, and developers use it to run Java libraries in web applications. Older applications, applets and Java Web Start are one use among several.

### What types of applications does CheerpJ support?

CheerpJ can run:

- Java desktop applications, including Swing and AWT, on Java 8 to 21, and 25 in preview
- Java libraries, called from JavaScript and TypeScript
- Java applets
- Java Web Start (JNLP) applications
- Oracle Forms and Oracle E-Business Suite

### How does CheerpJ work?

CheerpJ is a Java Virtual Machine that runs in the browser, on the OpenJDK class libraries and with OpenJDK's native code compiled to WebAssembly. It loads your compiled JAR files as they are, interprets the bytecode and compiles the frequently used parts as it runs. Nothing is recompiled ahead of time, nothing runs on a server, and nothing is installed on the user's machine. The [how CheerpJ works](https://cheerpj.com/how-cheerpj-works/) page explains it in more detail.

### What is the main difference between CheerpJ and other ways of putting Java on the web?

CheerpJ is the real Java runtime, running locally. Compared with the alternatives:

- **Java-to-JavaScript compilers** support only part of Java and need the source code; CheerpJ runs the whole language from your JARs.
- **Server-side streaming, Citrix and VDI** run the application on a server; CheerpJ runs it in the user's browser, with no server component.
- **Rewrites** take years; CheerpJ runs the application you have now.

The [comparison page](https://cheerpj.com/comparison/) sets out each option.

### Is CheerpJ a rewrite or a code conversion tool?

No. CheerpJ runs your existing bytecode. There is no conversion step and no generated code to maintain, so your application keeps its behaviour, its look and its release process.

### Can CheerpJ replace Citrix or VDI for our Java applications?

For Java applications, yes. CheerpJ runs the application in the user's browser, so you no longer need a remote session only to deliver Java. It is not a full VDI replacement: it does not deliver Windows desktops or non-Java native applications. The [Citrix and VDI page](https://cheerpj.com/replace-citrix-and-vdi-for-java-applications/) compares the two.

### Who uses CheerpJ?

Software vendors, enterprises and public sector organisations worldwide, including Fortune 500 companies and government agencies. Vendors use it to deliver their Java products on the web, organisations use it for their own and their vendors' Java applications, including Oracle Forms and EBS, and developers use it for Java libraries in web applications. [See the organisations that use CheerpJ](https://cheerpj.com/customers/).

## Choosing a product

### What is the difference between CheerpJ Core, the Applet Runner and the JNLP Runner?

They are one technology with three ways to deliver it:

- **CheerpJ Core** is the Java runtime itself, a set of static files you add to a web page or ship inside your product. Use it to build with Java for the browser, to run Java desktop applications and libraries, or to integrate CheerpJ into the server that hosts an applet or a Java Web Start application.
- **CheerpJ Applet Runner** is a browser extension that runs Java applets embedded in web pages, with no server changes.
- **CheerpJ JNLP Runner** is a browser extension that runs Java Web Start applications when the browser downloads a `.jnlp` file, with no server changes.

The extensions carry CheerpJ Core inside them, so the application runs and looks the same either way.

### Which one do I need?

If you are building a web application or a web edition of your product, use **CheerpJ Core**. For an existing application, look at how it starts today:

- It runs inside a web page, through an `<applet>` tag: the **Applet Runner**.
- The browser downloads a `.jnlp` file, or it starts through Java Web Start: the **JNLP Runner**.
- It launches as a desktop application, from a JAR or a start script: **CheerpJ Core**.

Some sites serve an applet to some users and Java Web Start to others, so check the launch type your users actually get. For applets and Java Web Start, you can also use CheerpJ Core on the server instead of an extension. The [extensions page](https://cheerpj.com/extensions/) has more detail.

### Should I use an extension or integrate CheerpJ Core on the server?

Both run the same runtime, with the same performance and appearance. Choose by who controls what:

- An **extension** needs no change to the application or its server, so it suits applications you do not control, such as a vendor's product, and fleets of managed Chrome or Edge browsers.
- **CheerpJ Core on the server** needs nothing on the user's machine, works in every supported browser, including Firefox and Safari, and suits applications you host and change yourself.

Many organisations test with an extension first and then decide.

### Is there a performance difference between the extensions and CheerpJ Core?

No. The extensions run CheerpJ Core inside the browser, exactly as a web page that includes it does.

## Building with CheerpJ

### Can I build a web edition of my Java desktop product with CheerpJ?

Yes. CheerpJ runs your Swing or AWT application from the same JARs you ship today, on the Java version you build for, so the web edition comes from the same codebase as the desktop one. It runs client-side and is delivered as static files, so you can offer it as SaaS, ship it to customers who host it themselves, or run it on air-gapped networks. The [CheerpJ Core page](https://cheerpj.com/cheerpj-core/) describes the runtime.

### How do I get started?

Add the CheerpJ loader to a web page with one script tag, serve your JARs from the same web server, and start the application with the same main class, classpath and arguments it uses today. A `java -jar app.jar` command becomes a `cheerpjRunJar` call, and a `java -cp … com.example.Main` command becomes a `cheerpjRunMain` call. The [getting started guide](/docs/getting-started/Java-app) walks through it, and technical evaluation is free.

### Which Java versions can I build for?

CheerpJ Core supports Java 8, 11, 17 and 21, with Java 25 in preview, each built from that release of OpenJDK. New Java LTS releases are added as they come out, so you are not held back to an old version. You choose the version when you start CheerpJ, with the [`version`](/docs/reference/cheerpjInit#version) option.

### What happens to JVM options such as -Xmx and -D?

System properties set with `-D` are passed with the [`javaProperties`](/docs/reference/cheerpjInit#javaproperties) option. Memory and tuning options such as `-Xmx` and `-XX` are not needed, because the browser manages memory.

### Can I call Java libraries from JavaScript?

Yes. CheerpJ's library mode lets JavaScript and TypeScript load Java classes, create objects and call methods, with automatic conversion of values, so you can use any Java library inside a web application, client-side, with no backend. Java can also call JavaScript and browser APIs through native methods implemented in JavaScript. See [Java libraries](https://cheerpj.com/java-libraries/) and the [interoperability page](https://cheerpj.com/interoperability/).

### Can I mix Java and web technologies in one application?

Yes. You can keep the business logic in Java and build the user interface with a web framework such as React or Angular, or run the existing Java interface next to new web screens and replace parts of it over time. Java and JavaScript call each other directly on the same page.

### How is CheerpJ different from compiling Java to JavaScript?

Java-to-JavaScript compilers support a subset of Java, need the source code and a port, and do not run Swing. CheerpJ runs the real OpenJDK class libraries on a JVM in the browser, so it runs the whole language and bytecode, including Swing, reflection, threads and dynamic class loading, from your compiled JARs.

### How is CheerpJ different from streaming the application from a server?

Server-side streaming runs a Java process on your servers for every user session and sends its screen to the browser. CheerpJ runs the application on the user's device, so there is no server JVM per user to provision and pay for, user data does not travel to a server to be drawn, and the application keeps working on slow connections. The [comparison page](https://cheerpj.com/comparison/) covers the options.

### Is CheerpJ free for developers?

CheerpJ is free for personal projects, technical evaluation, one-person companies and non-commercial open-source projects, with a "Built with CheerpJ" credit where the licence asks for one. Commercial products and SaaS use an Application licence; see [licensing](https://cheerpj.com/licensing/).

## Oracle Forms

### Can I use CheerpJ to run Oracle Forms, Oracle EBS, or any other Java-based Oracle product?

Yes. Many organisations worldwide use CheerpJ to run Oracle Java-based products, such as Oracle Forms and Oracle EBS, in modern browsers, including Fortune 500 companies and local and federal government agencies. The [Oracle Forms and EBS page](https://cheerpj.com/run-oracle-forms-and-ebs-in-the-browser/) explains how.

### How does CheerpJ run Oracle Forms?

The Oracle Forms client is a Java program, `frmall.jar` and your application's JARs, that talks to the Forms server over HTTP. CheerpJ runs that client, unchanged, in the browser. Your Forms server, `.fmx` modules and database stay exactly as they are, and you do not need to recompile or regenerate any form.

### Which Oracle Forms versions does CheerpJ support?

CheerpJ runs the Forms client of Oracle Forms 6i, 10g, 11g and 12c, whether it is deployed as an applet, through JInitiator or through Java Web Start. If you run Forms 14c, or a heavily customised client, [ask us for a compatibility review](https://cheerpj.com/contact/?from=compatibility-review).

### Do we need to change our Forms application?

No. The forms themselves do not change. The usual changes are in server configuration:

- the Forms client must connect over HTTP or HTTPS, not in socket mode;
- responses from the Forms servlets must not be compressed;
- to integrate CheerpJ on the server, you add a new section to `formsweb.cfg` and a copy of its HTML template that loads CheerpJ.

With the browser extensions, nothing on the server changes beyond the first two points.

### Our Forms application uses socket mode. Will it work?

Browsers do not let web pages open raw socket connections, so the Forms client must use HTTP mode. Set `connectMode` to `http` or `https` in `formsweb.cfg`, with `serverURL` pointing at the Forms listener servlet, usually `/forms/lservlet`. This is a standard Oracle Forms setting. In socket mode, the client typically fails with `FRM-92060` or a socket error.

### Does WebUtil work?

Yes. WebUtil works with CheerpJ, including file transfer, as long as you keep the browser's file model in mind:

- files the user uploads arrive in a dedicated upload folder, and files the application saves to the download folder are downloaded to the user's device;
- pass a plain file name, such as `report.txt` or `C:\Temp\report.txt`, as the client file name, not a path inside CheerpJ's virtual file system, or WebUtil fails with `WUT-131` and `WEBUTIL_FILE_TRANSFER` errors.

The [file system guide](/docs/guides/filesystem) describes where files go.

### What happens to CLIENT_HOST, OLE, DDE and client-side DLLs?

A browser cannot start programs on the user's machine, so `CLIENT_HOST` and `WebUtil_Host` calls run nothing by default. CheerpJ lets you intercept them in JavaScript and do the equivalent web action, such as opening a URL, or you can move the work to the server. OLE, COM and DDE automation and pre-built client DLLs cannot run in a browser, so forms that depend on them need a change. A [compatibility review](https://cheerpj.com/contact/?from=compatibility-review) finds these before a rollout.

### Our PL/SQL code reads the PC's name or IP address. Does that still work?

Web pages cannot see the computer's host name or IP address. When CheerpJ is integrated on the server, a value can be supplied through the `hostName` option. With the extensions, [contact us](https://cheerpj.com/contact/).

### Do Oracle Reports and printing work?

Yes. Reports opened in a new window or tab work as they do today, provided the browser allows pop-ups for the Forms site. When the Forms client prints, CheerpJ opens the browser's print dialog, where the user chooses any printer installed on the machine.

### Do keyboard shortcuts and function keys work?

Yes. CheerpJ can override browser shortcuts so that the Forms keys, such as F-keys and Ctrl combinations, reach the application, and the Applet Runner ships with the common Forms and EBS shortcuts preset. You can add your own in the extensions' settings, or with the [`overrideShortcuts`](/docs/reference/cheerpjInit#overrideshortcuts) option. A few browser shortcuts, such as closing a tab, can never be overridden.

### Can users open more than one Forms session?

Oracle Forms tracks the session with a cookie, and browser tabs share cookies, so a second session in another tab of the same browser can clash with the first. Your WebLogic configuration can change how Forms uses the session cookie. [Contact us](https://cheerpj.com/contact/) if you need several sessions per user.

### Is CheerpJ certified by Oracle?

No. Oracle certifies its own Java runtime, and CheerpJ is not endorsed by Oracle. CheerpJ runs the same Forms client JARs on its own build of OpenJDK, and organisations validate it by testing their applications, usually in a proof of concept.

### Can we build CheerpJ into a Forms-based product we sell or host for customers?

Yes. Software vendors integrate CheerpJ into the launch page of their Forms-based product, so their customers open it in the browser. Integration can also be the first step of a gradual modernisation, with Forms modules and new web screens on the same page. This is covered by an Application licence; see [licensing](https://cheerpj.com/licensing/).

## Oracle E-Business Suite

### Can CheerpJ run Oracle E-Business Suite?

Yes. The Forms-based parts of EBS use a Java client, and CheerpJ runs that client in Chrome and Edge, or in any supported browser when CheerpJ is integrated on the server. The HTML-based parts of EBS are unchanged. The [Oracle EBS page](https://cheerpj.com/oracle-ebs/) explains the options.

### Which EBS releases are supported?

EBS launches its Forms client either as an applet or through Java Web Start, depending on the release and configuration, and CheerpJ supports both. Organisations run CheerpJ with EBS 11i and R12. Every EBS environment is configured differently, so we recommend a short test with the browser extension, which is free for technical evaluation.

### Which extension do I need for EBS?

It depends on your EBS configuration. If Forms opens inside the browser page, use the Applet Runner. If the browser downloads a `.jnlp` file, use the JNLP Runner. If your DBA changes the launch mode, change the extension too.

### Do we have to change our EBS configuration?

With the extensions, usually not. Check that Forms connects over HTTP or HTTPS, that the Forms servlets are not compressed, and that the EBS host is not on Edge's Internet Explorer mode site list for your users. If you do change EBS Forms settings, do it through AutoConfig with your DBA, because EBS patching overwrites manual edits.

### Can we integrate CheerpJ into EBS on the server instead of using an extension?

Yes, but on EBS the least invasive way is usually a reverse proxy that adds CheerpJ to the Forms launch page, instead of editing EBS templates, because patching can overwrite template edits. [Talk to us](https://cheerpj.com/contact/) before choosing this route.

### Do View Output and View Log work for concurrent requests?

Yes. They open in a new window, so allow pop-ups for the EBS site.

### We still use Internet Explorer mode for EBS. Can we retire it?

Yes. That is one of the most common reasons to use CheerpJ. Remove the EBS host from the Enterprise Mode Site List, at least for the users you are testing with, because CheerpJ cannot run inside Internet Explorer mode. The [retire IE mode page](https://cheerpj.com/retire-ie-mode/) describes the move.

## Applets and the Applet Runner

### Where can I find the full Documentation for the CheerpJ Applet Runner?

You can find the documentation for the CheerpJ Applet Runner [here](https://labs.leaningtech.com/docs/cheerpj-applet-runner).

### What browsers does the CheerpJ Applet Runner support?

The CheerpJ Applet Runner is a browser extension for Chrome and Edge, and other Chromium-based browsers.

To run applets in Firefox or Safari, integrate CheerpJ Core into the page that hosts the applet.

### Which Java version does the Applet Runner use?

Java 8. Applets were removed from Java after Java 8, so every applet was built for Java 8 or earlier, and keeping the extension to one runtime keeps its download small.

### Why should I use the CheerpJ Applet Runner?

CheerpJ allows you to keep running legacy Java applets that are either impossible or impractical to replace or upgrade, extending the life of your application with minimal investment.

It improves security by removing the need for a local Java installation and running the applet inside the browser sandbox.

### Do I need to install anything on my Desktops or Servers to use the CheerpJ Applet Runner?

No. The CheerpJ Applet Runner does not require a local Java installation on the desktop and does not require server-side integration.

Your applet and server can remain unchanged.

### Can I run an applet without the extension?

Yes. Add CheerpJ Core to the page that hosts the applet and it runs the `<applet>`, `<object>` and `<embed>` tags on the page. The [applet getting started guide](/docs/getting-started/Java-applet) shows how.

### Our page's JavaScript talks to the applet. Does that still work?

Yes. CheerpJ supports calls between the page and the applet in both directions. Pages written for Internet Explorer sometimes call the applet before it has started, or use Internet Explorer-only DOM features, and need a small change or a compatibility script. This is page behaviour, not a CheerpJ limitation, and we can help you find it.

### Can I self-host the CheerpJ Applet Runner, and can I run it on air-gapped environments?

Yes. We can assist you in self-hosting the CheerpJ Applet Runner so your organisation does not need access to the Chrome Web Store or the Edge Add-ons store.

A self-hostable version is available for enterprise use cases, including air-gapped environments. Please get in touch with [Enterprise Sales](https://cheerpj.com/contact/) if you are interested.

## Java Web Start and the JNLP Runner

### Where can I find the full Documentation for the CheerpJ JNLP Runner?

You can find the documentation for the CheerpJ JNLP Runner [here](https://labs.leaningtech.com/docs/cheerpj-jnlp-runner).

### What types of applications does the CheerpJ JNLP Runner support?

The CheerpJ JNLP Runner runs Java Web Start applications described by a JNLP file. It is based on CheerpJ Core and runs existing, unmodified Java Web Start applications inside the browser, without a local Java installation. It supports JNLP extensions, versioned JARs and pack200-compressed JARs.

### Which browsers does the CheerpJ JNLP Runner support?

The CheerpJ JNLP Runner is a browser extension for Chrome and Edge, and other Chromium-based browsers.

To run Java Web Start applications in Firefox or Safari, integrate CheerpJ Core on the server instead.

### Which Java versions are supported?

The JNLP Runner runs Java 8, the last Java release to include Java Web Start, which is what Java Web Start applications in the field were built for. If your application needs a newer Java version, run it with CheerpJ Core, which supports Java 8, 11, 17 and 21, or [contact us](https://cheerpj.com/contact/).

### Why should I use the CheerpJ JNLP Runner?

CheerpJ allows you to keep running legacy Java Web Start applications that are either impossible or impractical to replace or upgrade, extending the life of your application with minimal investment.

The CheerpJ JNLP Runner improves security by removing the need for a local Java installation and running the application inside the browser sandbox.

### Do I need to install anything on my Desktops or Servers to use the CheerpJ JNLP Runner?

No. The CheerpJ JNLP Runner does not require a local Java installation on the desktop and does not require server-side integration.

Your application can remain unchanged.

### Which Java Web Start services are supported?

The `BasicService`, `SingleInstanceService` and `PersistenceService` JNLP services are supported. If your application uses another service, [tell us which](https://cheerpj.com/contact/).

### Our JNLP file lists native libraries. Will it work?

Native libraries listed with `<nativelib>` are pre-built binaries, which cannot run in a browser. If the application cannot run without them, it needs a change; a [compatibility review](https://cheerpj.com/contact/?from=compatibility-review) tells you what.

### Can I deploy the CheerpJ JNLP Runner extension using Group Policies?

Yes. You can deploy both CheerpJ extensions to your organisation's machines with Group Policy in Chrome or Edge, pin them to the toolbar, and push licence tokens and settings. See the [enterprise configuration guide](https://labs.leaningtech.com/docs/cheerpj-jnlp-runner/guides/configure-extension-for-enterprises).

### Can I self-host the CheerpJ JNLP Runner, and can I run it on air-gapped environments?

Yes. We can assist you in self-hosting the CheerpJ JNLP Runner so your organisation does not need access to the Chrome Web Store or the Edge Add-ons store.

A self-hostable version is available for enterprise use cases, including air-gapped environments. Please get in touch with [Enterprise Sales](https://cheerpj.com/contact/) if you are interested.

## Compatibility

### Does CheerpJ support all Java APIs?

CheerpJ runs the OpenJDK class library itself, not a reimplementation, and supports the whole Java language and bytecode. Most production Java applications work out of the box, including those using Swing, AWT, multithreading, networking, reflection, custom class loaders and dynamic constructs.

What a browser does not allow, such as starting local programs or loading pre-built native binaries, needs a different approach. The [compatibility page](https://cheerpj.com/compatibility/) lists it in detail.

### Which Java versions are supported?

- **CheerpJ Core:** Java 8, 11, 17 and 21, with Java 25 in preview, each built from that release of OpenJDK
- **Applet Runner and JNLP Runner:** Java 8
- **Legacy support:** Java 6 and 7 on the respective CheerpJ LTS versions, available on request

CheerpJ adds each new Java LTS release. In CheerpJ Core you choose the version when you start CheerpJ, with the [`version`](/docs/reference/cheerpjInit#version) option.

### Which GUI frameworks are supported?

- Swing: supported
- AWT: supported
- Oracle Forms, including as part of E-Business Suite: supported
- JavaFX: not supported today, planned for 2027
- SWT: not supported

### Our application uses JavaFX. Can CheerpJ run it?

Not today. JavaFX support is planned for 2027. If your application uses JavaFX only for an embedded web view inside a Swing application, [contact us](https://cheerpj.com/contact/), because that case can often be handled with the browser itself.

### Which browsers are supported?

- Chrome, Edge, and other Chromium-based browsers
- Firefox
- Safari

The Applet Runner and JNLP Runner extensions run in Chrome, Edge and other Chromium-based browsers. Minimum versions are on the [compatibility page](https://cheerpj.com/compatibility/).

### Does CheerpJ work on mobile?

Yes, CheerpJ Core runs in mobile browsers on Android, iOS and iPadOS. It supports touch input and virtual keyboards, and a long press acts as a mouse hover.

### Does CheerpJ require source code?

No. It runs directly on compiled Java bytecode (.jar or .class files), including encrypted and obfuscated code. Third-party libraries and components whose source code you do not have run just like your own code.

### Does CheerpJ support JNI?

Yes. CheerpJ includes OpenJDK's own native code, compiled to WebAssembly, so the Java Native Interface works as it does on a desktop. Your application's own native methods can be implemented in JavaScript or compiled to WebAssembly.

What cannot run are pre-built native binaries, such as `.dll`, `.so` and `.dylib` files, including those packaged inside JARs. If you have the C or C++ source, it can sometimes be compiled to WebAssembly; [ask us](https://cheerpj.com/contact/).

### Do signed JARs work?

Yes. Serve the original signed JARs. Re-signing or repackaging them can cause `SecurityException` errors if the signatures no longer match.

### Does the application look the same?

Yes. CheerpJ runs the application's own Swing or AWT code and draws it exactly as Java does, so screens, fonts and layouts match the desktop version closely. CheerpJ ships its own fonts, so text can differ slightly where an application relied on fonts installed on Windows.

## Files, printing and networking

### Can the application read and write files?

Yes, inside CheerpJ's virtual file system. Files your server publishes are readable, and the application has persistent storage in the browser for the files it writes. A web page cannot read or write the user's disk directly, so files reach the device through uploads and downloads: the user picks files to upload, and files saved to the download folder are downloaded to the device. The [file system guide](/docs/guides/filesystem) explains the folders.

### Can the application open a file in Excel, Word or a PDF viewer?

A browser cannot hand a file to a desktop application, so calls such as `Desktop.open()`, or `Desktop.browse()` with a local file, cannot work as on the desktop. Instead, download the file to the user, or open it in a browser tab with a blob URL from [`cjFileBlob`](/docs/reference/cjFileBlob).

### Does printing work?

Yes. When the application prints, CheerpJ renders the pages and opens the browser's print dialog, where the user chooses a printer or saves a PDF. The application sees one virtual printer, not the list of printers installed on the machine. Allow pop-ups for the site if the dialog does not appear.

### Does copy and paste work?

Yes. By default, copy and paste work inside the Java application. Sharing the clipboard with other applications on the machine is an option, and browsers allow it only on sites served over HTTPS. See the [`clipboardMode`](/docs/reference/cheerpjInit#clipboardmode) option.

### Can the application connect to our back-end services?

Yes. HTTP and HTTPS requests work as usual and go through the browser, so your network, proxies and certificates apply. Services on a different domain from the page must allow cross-origin requests from it.

### Our application opens TCP connections or connects directly to a database. Does that work?

Browsers do not give web pages raw TCP or UDP connections. CheerpJ provides them through Tailscale, a WireGuard-based VPN that can be self-hosted, or through a custom networking backend in enterprise deployments. See the [networking guide](/docs/guides/Networking). Many applications avoid the question entirely, because they already talk to their server over HTTP.

### Do Java proxy settings apply?

HTTP and HTTPS traffic goes through the browser, so the browser's proxy settings apply, and Java's own proxy settings are not used.

### Can the application run external commands?

A browser cannot start programs, so `Runtime.exec` and similar calls run nothing by default. You can intercept them in JavaScript and do something equivalent, such as opening a URL; see the [guide to intercepting external commands](/docs/guides/Intercept-external-commands).

## Performance

### How is performance compared to a local JVM?

Once the code has warmed up, CheerpJ runs Java with a multi-tier JIT compiler in the browser, and interactive applications are responsive. Startup is generally slower than a local JVM, because the browser downloads the runtime and the application's JARs, and the code warms up each time the page loads.

### How do I measure startup time fairly?

Measure the second launch, not the first, because the first one downloads everything. Close the browser's developer tools, which slow CheerpJ down considerably, and test without other extensions. Microsoft Edge's enhanced security mode can turn off the browser's JavaScript compiler on some sites, which also slows CheerpJ, so add your site as an exception if it is on.

### How can I make startup faster?

Serve JARs with caching headers, so they download only once, and with compression. CheerpJ fetches only the parts of the runtime it needs, and you can preload them. See the [startup time guide](/docs/guides/Startup-time-optimization).

### Does CheerpJ keep its own cache of our JARs?

No. CheerpJ relies on the browser's normal HTTP cache. If JARs download again on every launch, the server is not sending caching headers such as `Cache-Control` or `ETag`. Applet attributes such as `cache_archive` belonged to the Java plug-in's own cache and are not needed.

## Deployment & Hosting

### What deployment models does CheerpJ offer?

CheerpJ Core is a collection of static JavaScript and WebAssembly files and OpenJDK artefacts. You can load it from the CheerpJ CDN or serve it from any standard HTTP server or CDN. The extensions install in the browser, from the Chrome Web Store or the Edge Add-ons store, or from a self-hosted build. The [deployment page](https://cheerpj.com/deployment/) describes the options.

### Does CheerpJ require server changes?

No server-side software is needed. CheerpJ works with standard web servers and CDNs, such as nginx, Apache, IIS, WebLogic or Oracle HTTP Server. The server must support HTTP range requests, and should send caching headers and use compression for runtime files. Production deployments should use HTTPS.

### Where can CheerpJ be hosted?

- The CheerpJ CDN
- Your own servers or CDN
- Air-gapped environments, with no connection to any external network

### Can I self-host CheerpJ?

Yes. Self-hosting is included with Enterprise licences, is available as an add-on with Small Business licences, and is allowed during technical evaluation. Serving the runtime from anywhere other than the CheerpJ CDN, including copying it into your own repository or package, counts as self-hosting. See the [server setup guide](/docs/guides/basic-server-setup).

### Can I host CheerpJ on multiple servers?

Yes. Hosting on more than one server, including with load balancers and CDNs, is allowed within the scope of one licence.

### Can I host CheerpJ in an air-gapped environment?

Yes. Enterprise licences include a self-hosted build of CheerpJ Core and both extensions that contacts no external server, with offline licence tokens.

### Does CheerpJ work with our single sign-on?

Yes. The application runs in a normal browser page, so it sits behind your existing authentication, and its HTTP requests carry the browser's cookies and certificates.

### How do we roll CheerpJ out to all our users?

For the extensions, push them with Group Policy or Chrome and Edge policies, together with offline licence tokens and settings. For CheerpJ Core, there is nothing to install: users open a URL. In both cases, remove the application's host from Edge's Internet Explorer mode site list.

## Security & Privacy

### How does CheerpJ handle security?

CheerpJ is a pure web application, and therefore inherits the web security model, a significant improvement in security compared to standard, locally installed Java. CheerpJ:

- Runs entirely in the browser sandbox
- Inherits the web security model, including cross-origin restrictions
- Removes Java plug-in vulnerabilities by eliminating client-side JVM requirements
- Is compatible with zero-trust architectures and secure mobile and thin-client deployments

The [security page](https://cheerpj.com/security/) describes the model in detail.

### Does CheerpJ send any data to Leaning Technologies?

The self-hosted builds used in enterprise deployments contact no server at all: no licence server, no analytics and no metering. The CheerpJ runtime itself makes only the requests your application makes. The extensions installed from the browser stores check licences online; their privacy policies list what they collect.

### Do we still need to patch Java on our desktops?

Not for the applications that move to CheerpJ, because there is no Java installed on the desktop. CheerpJ updates are delivered as new web files on your server, or as extension updates.

## Troubleshooting

### The local Java, Internet Explorer mode or nothing at all opens instead of CheerpJ. Why?

CheerpJ cannot run inside Edge's Internet Explorer mode, so remove the site from the Enterprise Mode Site List. When testing, also uninstall or disable local Java and other Java-related extensions, which can take over the launch.

### Oracle Forms fails with FRM-92060 or a socket error.

The Forms client is in socket mode. Set `connectMode` to `http` or `https`, with `serverURL` pointing at the listener servlet. If the listener servlet returns a 404, the problem is in the Forms server's mapping.

### Oracle Forms starts but fails, although every request returns HTTP 200.

Check whether a proxy, load balancer or web server compresses the responses of `/forms/frmservlet` or `/forms/lservlet`. The Forms client never asks for compression and cannot read it, so exclude `/forms/` from compression.

### Forms will not start again after the user closed the tab.

Closing the tab without exiting Forms can leave its session cookie in the browser, and the next launch fails. Exit Forms from its own menu, or clear the site's cookies. Your WebLogic configuration can also change how Forms uses the session cookie; [contact us](https://cheerpj.com/contact/) if this affects your users often.

### Nothing appears when the application opens a window, report or print dialog.

The browser has blocked a pop-up. Allow pop-ups for the site, or set the policy for your managed browsers.

### Copy and paste between the application and other programs does not work.

Browsers share the system clipboard only with sites served over HTTPS. Serve the application over HTTPS, and turn on the system clipboard in the extension's settings or with the `clipboardMode` option.

### Text in menus or fields is cut off.

Update to the latest version of the extension or runtime. If text is still cut off on displays with Windows scaling, turn on the setting that disables display scaling in the extension's advanced settings.

### The licence key does not validate.

Corporate web filters often block the extension's licence check. Ask your IT team to allow it, or use offline licence tokens, which enterprise deployments receive through Group Policy.

### The page shows the CheerpJ "runtime ready" message, but the application does not start.

Check that the page is served over HTTP or HTTPS, not opened as a `file://` URL, that the paths to your JARs are CheerpJ virtual paths, and that no JAR returns a 404. Some 404 errors for runtime files at startup are normal.

### The console reports that the server does not support range requests.

CheerpJ loads JARs and runtime files in parts, with HTTP range requests. Use a web server that supports them; some simple development servers, such as Python's `http.server`, do not.

### The application cannot find a class or a file.

Check that every JAR on the classpath is listed explicitly, without wildcards, with its CheerpJ virtual path, and that file paths point into the virtual file system rather than the user's disk.

### The application loses its login or session cookies.

The old Java plug-in installed a cookie handler that shared the browser's cookies with Java. Java itself does not, so `CookieHandler.getDefault()` returns null. A small adapter class that registers a cookie handler restores the plug-in's behaviour; [contact us](https://cheerpj.com/contact/) for an example.

### How do I report a problem?

Follow the [debugging guide](/docs/guides/cheerpj-debug): open the browser's developer tools before the page loads, reproduce the problem, and save the console log and a HAR file. Send them with the browser, the CheerpJ or extension version, how the application launches, the exact error text and the steps to reproduce. Customers can write to support; everyone can open an issue on [GitHub](https://github.com/leaningtech/cheerpj-meta/issues) or ask the community on Discord.

## Licensing & Support

### How is CheerpJ licenced?

CheerpJ licences are based on who uses the application:

- **Desktop licences** cover Java applications your organisation uses, including vendor applications such as Oracle Forms and EBS. They are priced per desktop.
- **Application licences** cover software you build with CheerpJ for customers or the public. They are priced per application, or per developer for small businesses.

Each has a free Community tier. See [licensing and pricing](https://cheerpj.com/licensing/).

### Is CheerpJ free?

CheerpJ is free for personal, educational and hobby use, for technical evaluation by organisations of any size, and, with a "Built with CheerpJ" credit, for one-person companies and non-commercial open-source projects. Business use needs a licence.

### We run Oracle Forms or EBS for our staff. Which licence do we need?

A Desktop licence. Count the machines whose browser opens Forms or EBS through CheerpJ. Small teams can buy online, and larger deployments use Enterprise (Desktop), which is priced on volume and includes the self-hosted build.

### Does the licence depend on whether we use an extension or CheerpJ Core?

No. A Desktop licence covers the Applet Runner, the JNLP Runner and CheerpJ Core on that desktop.

### Who holds the licence when a partner or contractor deploys CheerpJ for us?

The organisation whose users run the application, or the vendor who ships it. A system integrator's licence does not cover its clients.

### Are licences annual or perpetual?

Desktop licences for small teams are monthly subscriptions. Enterprise licences run for one, two or three years, and perpetual licences are available.

### Is usage metered?

No. Enterprise deployments are self-hosted and contact no licence server, and desktop counts are self-reported.

### Does the licence include software updates and support?

Yes. Every licence includes updates. Enterprise licences also receive out-of-cycle updates and fixes, and include basic support. Small teams' Desktop licences include email support.

### Can I get a custom support agreement with SLAs?

Yes. Enterprise customers can add a support agreement with 24-hour or 48-hour response times.

### Where can I find documentation?

This is CheerpJ's technical documentation: start with [getting started](/docs/getting-started). The extensions have their own documentation for the [Applet Runner](https://labs.leaningtech.com/docs/cheerpj-applet-runner) and the [JNLP Runner](https://labs.leaningtech.com/docs/cheerpj-jnlp-runner).

### How quickly can I run a Proof of concept?

Many customers complete a working proof of concept in one week. Testing with an extension is often a matter of hours. For Oracle estates, large rollouts or applications with native dependencies, [ask us for a compatibility review](https://cheerpj.com/contact/?from=compatibility-review).
