---
title: "JSExport: C++ in the browser made easy"
description: |
  Here at Leaning Technologies we build compilers for the Web (which output a combination of JavaScript and WebAssembly).
pubDate: "2020-06-30"
categories:
  - "technical-blog"
authors:
  - carlo
heroImage: ./jsexport-output.webp
tags:
  - Cheerp
---

Here at Leaning Technologies we build compilers for the Web (which output a combination of JavaScript and WebAssembly).

Think taking a C++ codebase, feeding it into a LLVM/clang based compiler, and getting something that can to interact with arbitrary JavaScript libraries and the general browser environment. This is [Cheerp](https://leaningtech.com/pages/cheerp.html) in a nutshell.

Recently, I have been working on one of Cheerp’s unique features, `[[cheerp::jsexport]]`, a custom attribute that allows one to create powerful interfaces between generated and ‘native’ JavaScript. Some cool things now possible thanks to this technology will be shown in this article series. Enjoy!

![](/blog/0*WncSwGz75W-GAPRO.gif)

std::shuffle applied to [https://www.google.com/search?q=how+to+shuffle+array](https://www.google.com/search?q=how+to+shuffle+array)

For the last many weeks, I had been busy cleaning up, testing, and improving on `[[cheerp::jsexport`\]\]. The first phase has now been merged into our main branch ([GitHub](https://github.com/leaningtech/cheerp-clang/blob/bde23c135d741403af18096de4281fab0026f36c/lib/Sema/SemaCheerp.cpp)), and it’s now available for everyone to experiment with ([Cheerp’s PPA](https://github.com/leaningtech/cheerp-meta/wiki/Ubuntu-Debian-installation-using-PPA)), so it’s the right moment to show some examples of how it can be used and what can be achieved with it + some discussion of the (current) [limitations](https://github.com/leaningtech/cheerp-meta/wiki/JSExport-attribute) and the possible usage of JSExported classes and free functions.

## GCD

Let’s start from the basics.

Say you need to calculate the [Greatest Common Divisor](https://en.wikipedia.org/wiki/Greatest_common_divisor) of two numbers in your ilovenumbertheory.org website.

You happen to find that you already have a gcd implementation that you trust being correct, and it happens to be in C++.

![](./images/Screenshot-2021-08-10-at-09.35.57-300x132.png)

You add then the tag `[[cheerp::jsexport]]` in front of the definition, go to you favorite (and only) C++ to JavaScript compiler, invoke it with

/opt/cheerp/bin/clang++ gcd.cpp -o gcd.js -target cheerp -cheerp-pretty-code

And obtain:

![](./images/Screenshot-2021-08-10-at-09.36.39-300x263.png)

What just happened here? Let’s dissect.

The C++ function has been compiled to JavaScript. You can still recognize what’s happening, there are few casts to integer (to force JavaScript to use 32-bit integers instead of 64-bit floating point math), a loop, a modulo calculation, a swap. Basically the original algorithm has been translated into JavaScript syntax.

What is this for?

Now you can play with something like this directly in your browser console:

![](./images/0*BEf7t0I7omc429dP.png)

It works!

Great. So a function with signature `int(int,int)` can be converted to an equivalent JavaScript function. Something else?

## Shuffle

![](./images/Screenshot-2021-08-10-at-09.37.11-300x126.png)

Here we have a function that randomly shuffles a JavaScript array in place. It takes a random seed, feed it into a pseudo-random generator, and use the [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) on the array.

Now once compiled with:

/opt/cheerp/bin/clang++ cheerpShuffle.cpp -o cheerpShuffle.js -Os -target cheerp

We will obtain a minified blob of characters that represent the exact same logic back into JavaScript: [gist on GitHub](https://gist.github.com/carlopi/2d53573a7ff655b9b21bfc45e6ae312a).

This is just regular JavaScript code, so it could be invoked in any environment that executes JavaScript, e.g. scrambling around elements of a web page at will:

![](/blog/0*Zd-2hgTqw1743gGY.gif)

My proposal for next year’s Easter’s egg

This is fun, but do not try it at home. (But feel free to do it [here](https://leaningtech.com/pages/cheerp_demos.html).)

## Free functions limitations

Now it’s the right time to say that there are limitations on the free functions taggable with `[[cheerp::jsexport]]`.

They come in a few flavors:

- arguments/return types: bool/char/short/int/floats/doubles are supported. No 64 bit integers for now (we may support them in the future using BigInt to represent them)
- arguments/return types: only pointers to struct/classes tagged as `[[cheerp::jsexport]]` (representing native-like objects) or pointers to “client” JavaScript objects (DOM elements, Strings, Arrays, Sets or more complex objects declared on the JavaScript code) or (with some restrictions) pointers to functions
- naming: there can’t be 2 JSExported functions that share the same name, since C++ overloading rules are based on parameter types and do not naturally map to JavaScript
- naming: no [reserved JavaScript identifiers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords)
- no templated functions, since there is no way of instantiating new templates at runtime

Cheerp will give you a compile-time error whenever any of these rule are broken, explaining what went wrong AND how to fix the problem. There is also a more proper [documentation](https://github.com/leaningtech/cheerp-meta/wiki/JSExport-attribute) to help out.

## And now, stateful objects

Exporting free functions is helpful on its own, but the possibility of exporting classes or structs it’s even more powerful (and comes with an additional set of limitations).

I have here one basic example, a class that generates pseudo-random numbers according to the normal distribution.

![](./images/Screenshot-2021-08-10-at-09.37.35-300x202.png)

Then compiling with:

/opt/cheerp/bin/clang++ normalDistribution.cpp -o normalDistribution.js -Os -target cheerp

We obtain the relative JavaScript code ([link to gist](https://gist.github.com/carlopi/12ed807f4c480627ebf1c45efc35880a)), that then can be instantiated like:

![](./images/0*JMiXelZhR7G0Rwlp.png)

Standard Dilbert: are you sure that’s random?

Few things to note here:

- The instance of the class actually holds state (mostly the 624\*32 bits representing the state of the Mersenne twister random engine + some additional variables)
- The class exports both a constructor (that has to be called with new ClassName(arguments)) and a generate() member function
- This class lives completely on the JavaScript side, and the Garbage Collector will take care of getting rid of it after any reference isn’t held any more

## Classes/structs restrictions

Stateful objects have great power, but also a major limitation: they need to have a trivial destructor. The reason for this limitation is that JavaScript lacks the concept of “finalizers”. Since C++ destructors can, in general, do anything it is not safe to let the GC simply collect objects which are not referenced anymore, *unless* their destructor is “trivial”, which means that it does nothing.

There is still much that can be done without a destructor (e.g. I implemented a C++ compiled to JavaScript Big Integer implementation that does not rely on it[, see BigInt.js](https://medium.com/leaningtech/a-fast-bigint-js-in-an-evening-compiling-c-to-javascript-db61ae733512)). But as is, it’s cumbersome, and we will relax this by providing a special method “delete”, and for classes/struct with non-trivial destructors it would be the user’s responsibility to call the delete method when she is ready to let the object go.

For now the main limitations are basically the same of the free-functions, plus:

- JSExported classes needs a public constructor
- JSExported classes should have a trivial destructor
- No inheritance
- Fields are not JSExported (but you can and should define getter / setter methods)

Some of these limitations may and will be lifted.

I would love to have the possibility to just do:

class \[\[cheerp::jsexport\]\] SetOfElems :
public std::set<client::HTMLElement\*>
{
...
};

and have it magically work. It may be possible in the future (with some caveats) but the main focus has been on building a stable set of features that’s useful AND forward compatible.

## Why compiling to JavaScript?

Why may one want to generate JavaScript starting from C++ code?

Either the problem you are trying to solve is already solved in a C++ library that you trust has already gone through the process of finding and fixing problems.

Or the problem is easily solved in C++ than in JavaScript (eg. write a performant prime number sieve, it could be done in JavaScript, but I would bet a C++-compiled-down-to-JavaScript is likely faster here).

Or you may need to already maintain a C++ codebase, and generating JavaScript from the C++ means avoiding the time/cost of keeping the two aligned.

## JSExporting WebAssembly?

In all the examples there was a `-target cheerp`option, that means that the libraries code and all will be compiled to generic JavaScript.

Compiling only to generic JavaScript (as opposed to WebAssembly) forces additional limitations, since only a (large) subset of C++ can be efficiently compiled to JavaScript. But the default option is `-target cheerp-wasm`, meaning that the main bulk of the code is handled in WebAssembly and only interactions with the DOM / native JavaScript libraries / `[[cheerp::jsexport]]`\-ed function or classes have a JavaScript representation.

The interactions between JSExport and Wasm, expecially for objects, require a few more details to be ironed out, I will be busy doing that until the next post, where I will expand on this side.

I would love to see any experiment done with `[[cheerp::jsexport]]`.

We will be available either on [StackOverflow](https://stackoverflow.com/questions/ask?tags=cheerp) or [Gitter](https://gitter.im/leaningtech/cheerp) to help you out.
