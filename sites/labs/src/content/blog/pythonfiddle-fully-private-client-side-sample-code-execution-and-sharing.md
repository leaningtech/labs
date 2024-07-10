---
title: "PythonFiddle: Fully private client-side sample code execution and sharing"
description: |
  A recurrent need for anybody practising programming is running (and sharing) small snippets of code to quickly test an idea or ask for feedback. These kinds of Web applications are generally called ‘fiddles’, and there are plenty of them out there. The common use cases for fiddles are in education, but anyone can find themselves needing to use one to avoid having to set up a full native execution environment.
pubDate: "2022-09-14"
categories:
  - "technical-blog"
  - "webvm"
authors:
  - jules
heroImage: ./pythonfiddle.png
---

A recurrent need for anybody practising programming is running (and sharing) small snippets of code to quickly test an idea or ask for feedback. These kinds of Web applications are generally called ‘fiddles’, and there are plenty of them out there. The common use cases for fiddles are in education, but anyone can find themselves needing to use one to avoid having to set up a full native execution environment.

Most of these types of fiddles work by sending user code to a virtual machine that runs in the cloud. The program is then executed remotely and the result is sent back. Using a modern cloud environment has lots of advantages, in particular scalability and relatively low costs, but it does leave the developer open to a few issues:

- **Privacy**: There are two parties who need to be concerned about privacy: the user and the service provider. For users the main concern is what is done with their data. Will it be stored on the servers or possibly left accessible in logs. The provider on the other hand will need to know what they can and cannot do with user data, and if they’ll need to inform or ask the user for consent. This is particularly true in cases where the data isn’t just code snippets.
- **Security**: Allowing execution of arbitrary, user-written code can leave service providers vulnerable to abuse. It’s possible to harness the computational power meant for running the application for malicious purposes, like DDoS attacks or crypto mining. These are real problems for any platform that allows anonymous execution. This problem is extremely difficult to solve, since users are fundamentally unpredictable, whether we are speaking of the code they produce or their intentions with the application. Often primitive solutions such as timeouts, quotas and banning packages or libraries are used as a workaround.
- **Cost**: As low as the computing costs might be, somebody will still need to fork over the payment for those servers. The scalable nature of the cloud implies that, as the project gains more success, the costs will also scale. This may become an issue for single developers, Free and open-source software projects, or non-profit organizations.

An ideal alternative to cloud-based execution would be to take an existing language implementation and port it to the browser environment. The effort required will of course depend on the language ported and complexity of implementation, but it’s reasonable to expect it will be significant. On top of the effort put into the porting process, it will be easy to introduce brand new issues, and none of the work will automatically translate to supporting a new language.

Several years ago we released [JavaFiddle](http://javafiddle.leaningtech.com), a client-side execution environment, that was able to address most of the problems mentioned above. It’s based on [CheerpJ](https://leaningtech.com/cheerpj), our solution to compile and execute Java bytecode on the browser in [WebAssembly](https://webassembly.org/) and Javascript. Because of this, JavaFiddle is able to run Java applications sandboxed in the browser. This solution worked very well and the application gained quite some use.

Now we’re releasing [PythonFiddle](http://pythonfiddle.leaningtech.com), a similar environment, that allows the user to play around with python. This time, however, it’s based on [CheerpX](https://leaningtech.com/cheerpx), our WebAssembly based x86 virtual machine, that is able to run any program that is compiled to x86 assembly. This solution will allow us to bring a similar solution to many different language implementations, and much more.

![](https://cdn-images-1.medium.com/max/800/0*o-URuAfTdPnfXd_T)

A fiddle implementation using the cloud vs using CheerpX

### What is CheerpX?

CheerpX is a virtual machine that is able to run x86 executable programs in the browser. It’s based on WebAssembly, a new bytecode for the browser intended to be used as a compilation target for programming languages. CheerpX has a two tiered execution engine composed of an interpreter and a just-in-time compiler. The interpreter runs rarely executed assembly instructions and generates metadata for the JIT, which in turn can generate efficient Wasm modules for frequently run code.

Working directly with machine code has several advantages for CheerpX:

- **Robustness**: most programs will just work without issues. Compiling from source to Wasm is technically possible, but would lead to us needing to support many more individual use cases, and a lot of software wouldn’t be viable for execution.
- **Versatility**: There are also cases where there is no source code available for compilation, like Flash. This will not be an issue for CheerpX either.
- **Accuracy**: Applications will run identically to the way they work in native.

As an added bonus, CheerpX provides extensive support for file manipulation using a virtualized file system based on Ext2. The disk blocks are downloaded on demand from our CDN to minimize network usage. The blocks are themselves cached using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to avoid redundant downloads on later visits. As the file system and all the changes made in it are stored in the browser’s local IndexedDB, none of this data will appear on our servers either, which makes this solution both extremely scalable and privacy preserving.

### What is PythonFiddle?

PythonFiddle is composed of a few components:

- **CheerpX**: runs the python interpreter with the user-written code snippet in real time in the browser.
- **Debian buster disk image**: gives access to a complete file system.
- **Xterm.js**: provides a full terminal experience, including formatting and support for curses-based apps.

Being able to leverage the features mentioned above gives us a slew of advantages on this project:

- **Native-like execution**: with access to a proper file system and multiprocessing capabilities, the users will be able to take advantage of most functionalities of python without issues. This includes read/write access to a full debian file system image, multithreading, subprocess and most python libraries.
- **Privacy-preserving code sharing**: To share code, it is compressed and encoded as a hash of the url using lz-string, and then decoded on the receiving side directly from the url. This way users can share their code without it having to pass through our servers. You can test it by using this [link](https://pythonfiddle.leaningtech.com/#A4JwlgdgLgFARACTAAgGYgPYFtkEMRRgDGANgKZwCUQA).
- **Robust against abuse**: since code execution occurs entirely sandboxed to client-side and nothing will be sent to our servers, we are safe from any form of undesired usage.
- **Scalability without costs**: all processing and execution occurs client-side, which means that a minimal amount of our resources will be spent, even if the amount of users grows considerably.

Although we believe PythonFiddle (and the updated JavaFiddle) to be useful in themselves, CheerpX has the potential to be used in much more sophisticated applications. The possibilities are not limited to language implementations either, but any x86 code can run safely client-side. It’s a stable technology already exposed to the public via the many demos we’ve released over the past months. The most recent demo, WebVM, runs a full terminal session in a debian distribution in the browser. This shows just how complex the tasks CheerpX can achieve are.

Integrating CheerpX in web apps isn’t complicated either. The fiddle itself is just a thin layer on top of the CheerpX API. To run any program, you’ll only need to call the \`CheerpX.run(…)\` API call with the program, and CheerpX will take care of everything.

```
CheerpX.run(“python3”, [“-c”, “print(’Hello world!’)”], env);
```

CheerpX is already incredibly versatile technology, but nevertheless, we’re continuously adding more functionality. Currently we’re implementing networking capabilities and support for running graphical applications. This would allow the creation of even more complex demos and applications. The possibilities are endless.

As CheerpX is so adaptable, there are certainly many use cases we have not thought of yet, and therefore we are looking for partners who will bring CheerpX to unexplored markets. If you have a fantastic idea that could be made into a reality using CheerpX, please get in touch:

**Email**: [info@leaningtech.com](mailto:info@leaningtech.com)

**Twitter**: [https://twitter.com/leaningtech](https://twitter.com/leaningtech)

**Discord**: [discord.leaningtech.com](http://discord.leaningtech.com)

**Web**: [https://leaningtech.com/cheerpx](https://leaningtech.com/cheerpx)
