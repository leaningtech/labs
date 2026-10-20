# CheerpJ Forms demo

A Forms/EBS-style purchase order screen in Java, built to boot as fast as possible under CheerpJ.
No AWT, no Swing, no JavaFX, no dependencies, ~23 KB jar: Java draws every pixel into an `int[]`
framebuffer, runs the event loop, and puts each frame on a `<canvas>` through four small natives. Every frame and every typed character is drawn
by Java at runtime; there are no placeholder images or other loading tricks.

## At a glance

Cold first visits, from navigation start to the first frame painted:

|                                         | Time       | Requests | Download     |
| --------------------------------------- | ---------- | -------- | ------------ |
| First Forms version (4.3 loader)        | ~4.3 s     | ~97      | ~16.0 MB     |
| AWT, `20261016_3707` + `wasmGC`, Java 8 | 2.55 s     | 80       | 13.84 MiB    |
| AWT, Java 17, runtime preloaded         | 1.68 s     | 44       | 13.50 MiB    |
| **Now: no AWT, Java 17**                | **1.30 s** | **31**   | **8.95 MiB** |

The AWT rows and "Now" were each measured side by side with the version before (medians of 6
interleaved runs; the original measured 2.55–2.61 s in those batches).
What's left is CheerpJ's JVM booting: an empty `main()` on Java 17 needs ~1.1 s and ~8.9 MiB.

| File                    | What it is                                                                      |
| ----------------------- | ------------------------------------------------------------------------------- |
| `src/Forms.java`        | the whole app: data, layout, painting, input                                    |
| `src/Px.java`           | the software renderer Forms draws with (rects, lines, gradients, glyphs)        |
| `src/Web.java`          | the natives Forms uses in the browser: a canvas, frames, events, the cursor     |
| `src/FormsDesktop.java` | runs Forms in a desktop AWT window (`java -jar forms.jar`); not used on the web |
| `tools/GlyphGen.java`   | build-time tool that generates the glyph tables, 12px and 24px (see below)      |
| `build.sh`              | builds `forms.jar` (`javac --release 8`)                                        |
| `index.html`, `main.js` | the embed page; `main.js` boots CheerpJ and implements `Web`'s natives          |
| `forms.jar`             | the built app, so the page runs without a build                                 |

`build.sh` needs the Liberation Sans TTFs, by default from `/usr/share/fonts/liberation-sans-fonts`;
set `FONTS=/path` if they live elsewhere.

## Labs preview

The demo is also on the `Forms-Demo` branch of [leaningtech/labs](https://github.com/leaningtech/labs),
in `sites/labs/public/Forms-Demo/`, laid out like the `FlatLaf-Demo` branch: `index.html`,
`main.js`, `style.css`, the jar in `Forms/` and this README. PRs there get a Cloudflare Pages preview.

Cloudflare Pages ignores `Range` requests, which CheerpJ needs to read a jar from `/app/`. So
`main.js` fetches `forms.jar` whole (~36 KB) and hands it to CheerpJ's in-memory filesystem with
`cheerpOSAddStringFile("/str/forms.jar", …)`, then runs `/str/forms.jar`. FlatLaf writes its jars
to `/files/` through library mode instead; `/str/` avoids starting Java's file I/O before the form.

## Run locally

    ./build.sh
    npx http-server -p 8080 -c-1     # the server MUST support Range requests (python -m http.server doesn't)
    open http://localhost:8080/

`java -jar forms.jar` opens the same form in a desktop window.

## What it does

A master-detail form: a header block with required (yellow) and display-only (grey) items,
plus a tabbed multi-row lines block with a current-record indicator. You can:

- Edit text and use Tab/Shift+Tab, Enter and the Up/Down arrows to move around.
- Open a list of values with F9, Ctrl+L or the `…` button.
- Enter numbers only in Quantity/Price. Line amounts and the total are computed.
- Use the toolbar for New/Save/Previous/Next/Delete record (Ctrl+S also saves).
- Approve a PO, which locks it (record 2 starts out approved), or delete a line.
- See messages and the "Record: n/N" count in the status bar.

Menus and the tabs other than "Lines" only show a "not part of this demo" message. The names
are made up ("Demo Operations", fictional suppliers); there's no Oracle branding.

## How it runs without AWT

Everything, including the widgets, is painted by hand into one 860×500 framebuffer:

- **`Px`** is a tiny software renderer with exactly what Forms draws with: filled and outlined
  rects, 1 px lines, one 3 px line (the red cross), vertical/horizontal gradients, alpha blending
  (the dimmed backdrop behind the list of values), a clip rectangle, and glyph masks. Pixels are
  stored as `0xAABBGGRR`, the byte order of a canvas' `ImageData`, so the page copies a frame
  without converting it.
- **Java owns the screen.** `main.js` only boots CheerpJ and runs `Forms.main`, which puts the
  form on the page and runs the event loop. It reaches the page through `Web`, five CheerpJ
  natives that `main.js` implements as thin DOM bindings: `devicePixelRatio`, `open` (create and focus the canvas),
  `present(int[])` (`putImageData` of a frame), `setCursor`, and `nextEvent(timeoutMs)`, which
  blocks Java until a mouse or key event arrives or the caret-blink timer runs out. Java
  dispatches each event, handles everything already queued, and then presents one frame.
  The `int[]` reaches JS as an `Int32Array`; presenting a frame costs ~0.2 ms.
- **Key codes.** Forms uses DOM `keyCode` values (`K_*`). The browser needs to know at once
  whether to cancel a key's default action, before Java could answer, so `Forms.main` passes its
  key lists (`KEYS`, `CTRL_KEYS`) to `Web.open` and the page cancels just those, plus printable
  characters. Cmd and Alt shortcuts are left to the browser.
- **Same speed as library mode.** A first version drove Forms from JS through CheerpJ's library
  mode instead (log #27); this one measured the same (1.30 s against 1.37 s, interleaved).
- **Pixel check.** Captured in Chrome at scale 1, the new frame matches the AWT version on 70% of
  pixels exactly and within 1–2 levels nearly everywhere else (gradient and text blending
  rounding); 14 pixels at the ends of the red cross differ visibly.
- **HiDPI.** The canvas is shown at 860×500 CSS pixels. When `devicePixelRatio` is 1.5 or more,
  Forms draws at 2× (1720×1000 device pixels): `Px` scales rects, lines and gradients, and text
  comes from `Glyphs2`, the same font pre-rendered at 24px, so text is smooth and lines sharp.
  Layout still uses the 12px advances, so everything sits where it does at 1×. `Glyphs2` only
  loads at 2×; it and the bigger frame cost ~50–70 ms before the first frame on HiDPI screens.
- **Loader.** Until the first frame, the stage shows an inline HTML/CSS loader in the cheerpj.com
  brand style: the CheerpJ wordmark (from the design system), an orange bar and a label. No
  requests, and only `transform`/`opacity` animate. The bar slides until CheerpJ's
  `preloadProgress` reports, then follows the runtime preload to 90%; the first `Web.present`
  takes it down (160 ms fade). Measured side by side, it doesn't change the time to the first
  frame (1.28 s with, 1.30 s without). It honours `prefers-reduced-motion`.
- **Why not `idleCallback`.** CheerpJ's `idleCallback` (fires when every Java thread waits) would
  be the generic "app is up" signal, but it doesn't fire while Java waits in `Web.nextEvent`:
  a thread blocked in an async native counts as busy, like I/O. Waiting in `Object.wait` instead
  makes it fire (0.6 ms after the first frame, then on every blink), but then the page can't wake
  Java: CheerpJ refuses library calls into Java while `main()` runs, so events would have to be
  polled. The first `present()` is the same moment, so the loader uses that.

## Why it boots fast

- **No AWT.** AWT costs ~0.5 s and ~4.5 MiB of runtime before the first frame, and Swing more
  (see "Comparison" below). The page needs no CheerpJ display at all.
- **No lambdas, Java 8 bytecode.** Lambdas and Java 9+ string concatenation use
  `invokedynamic`, which pulls in `java.lang.invoke`. The jar runs on the Java 17 runtime.
- **`preloadResources`.** The runtime chunks the app needs are listed up front, so CheerpJ
  fetches them in parallel and doesn't discover them one at a time.
- **No font system** (see below).
- **`loader.js` is deferred**, so it doesn't block the page from rendering.
- **Runtime bootstrap preloaded.** `index.html` has `modulepreload`/`preload` hints for `cj3.js`,
  `cj3.wasm`, `cj3n17.wasm`, `cheerpOS.js` and `cheerpj.css` (see below).
- **CheerpJ build `20261016_3707` with Java 17 and `wasmGC: false`** (see below).

## No font system

Starting Java's font system (sun.font, TrueType parsing) costs ~1 s of CPU in CheerpJ the first
time any text is drawn. Forms never starts it: `tools/GlyphGen.java` runs at build time and
pre-renders Liberation Sans 12px regular and bold (the font CheerpJ uses) for ASCII into a
generated `Glyphs` class, and at 24px into `Glyphs2` for HiDPI screens. At runtime, `Forms.text()`
blends those glyphs into the framebuffer, decoding each glyph the first time it's drawn.

`GlyphGen` emits the glyph strings as non-constant expressions (`"…".toString()`), so `javac`
doesn't copy them into every class that reads them. The shipped 12px table is the one from the
original build; `tools/GlyphGen.java` was rewritten (the original wasn't available) and gives the
same advances and metrics, but 13% of its 12px pixels differ by a few alpha levels.

There is no font to fall back to without AWT, so characters outside the table are drawn as `?`,
and typing one shows "Only plain ASCII characters can be typed in this demo." (The AWT version
fell back to the real font, starting the font system the first time.)

Measured on cold first visits with the 4.3 loader and preloading, from navigation start to the first frame painted:

|                                                         | Time   |
| ------------------------------------------------------- | ------ |
| JVM boot until `main()` runs (same for an empty `main`) | ~3.0 s |
| Forms with the normal font system                       | ~4.3 s |
| Forms with the glyph table                              | ~3.3 s |

Trade-offs: the table adds ~6 KB to the jar and is for one font size.

## Loader, Java version and `wasmGC`

`main.js` uses the `20261016_3707` CheerpJ build with `version: 17` and `wasmGC: false`.
Cold loads of the AWT version, each setup with a preload list recorded on that setup and the
preload hints (medians, variants interleaved so they share the same machine load):

| Setup                                | Time   | Requests | Download  |
| ------------------------------------ | ------ | -------- | --------- |
| Java 8 + `wasmGC`, no hints (before) | 2.75 s | 80       | 13.84 MiB |
| Java 8 + `wasmGC`                    | 2.53 s | 80       | 13.84 MiB |
| Java 8                               | 2.56 s | 79       | 13.58 MiB |
| Java 11                              | 1.87 s | 45       | 13.18 MiB |
| **Java 17**                          | 1.93 s | 45       | 13.50 MiB |

All rows are from one batch of 6 rounds on a loaded machine. A second batch of 8 rounds gave
Java 11 1.75 s, Java 17 1.67 s and "before" 2.46 s: absolute times drift with load, the ranking didn't.

- **Java 11/17 beat Java 8.** On 4.3 they started slower (log #11); on this build, with a
  preload list recorded on them, they need about half the requests: the JDK's single `lib/modules`
  image replaces `rt.jar` and the five other jars Java 8 reads at boot. 11 and 17 are within noise
  of each other; 11 downloads ~0.4 MiB less.
- **Java 11/17 hang with `wasmGC: true`** on this build (no first frame within 30 s), so `wasmGC`
  is off. With the preload hints, `wasmGC` no longer made Java 8 faster either.

### Preloading the runtime bootstrap

Without hints, the boot is a waterfall: `loader.js` → `cj3.js` → `cj3.wasm` → `cj3n8.wasm` and
the `c.html` iframe → `c.js` → the first JRE read at ~580 ms. The `<link>` hints in `index.html`
start the first five at once and bring the first JRE read to ~330 ms (~0.2–0.35 s off the first
frame). They match CheerpJ's own requests (`import()` and `fetch()` in CORS mode), so nothing is
downloaded twice. The JRE reads themselves come from the `c.html` iframe, which has its own
HTTP cache partition, so the page can't preload those; `preloadResources` covers them.
When changing the build or the Java version, change the URLs (`cj3n<version>.wasm`) too.

## Where the download goes

Almost all of it is the JVM itself, from CheerpJ's CDN (HTTP/2, cached for a year, `Range` reads
in 128 KB pieces). Now that Forms loads no AWT, it downloads what an empty `main()` does (~8.9 MiB
on Java 17, mostly `lib/modules`), plus its 23 KB jar.

Earlier, on the 4.3 loader and Java 8, the AWT version was ~95 requests and ~15.2 MB, against
83 requests and 11.7 MB for an empty `main()`. Bisecting the difference then found two causes,
which the AWT version fixed: `addKeyListener` starting AWT's input method framework (~256 KB,
avoided with `enableInputMethods(false)`), and `fillPolygon`/`fillRoundRect` going through
Java2D's general shape rasterizer (~384 KB, replaced by `fillTri` and hand-drawn rounded buttons).
Neither applies any more, but `fillTri` and the buttons are still drawn the same way.

## Known issues

- **Preview build.** `20261016_3707` appears to be a dated preview build, not a release like 4.3.
- **License banner.** The CheerpJ Community Edition banner was drawn in CheerpJ's display, which
  this page no longer creates, so it isn't shown. On a business site, pass `licenseKey` to `cheerpjInit`.
- **Keep `wasmGC` off.** It hangs Java 11/17 on this build, and with it on (tested on Java 8)
  this build ignores `natives`, which the page now depends on. It also dropped keys typed in a
  burst and didn't draw `drawImage` under a scale; those were AWT-version issues.

## If you change the Java code

Rebuild with `build.sh`, then regenerate the preload list:

1. Set `PRELOAD = {}` in `main.js` and load the page in a fresh (e.g. incognito) window.
2. Once the form is on screen, and _without_ clicking or typing, run `cjGetRuntimeResources()` in
   the browser console. Interacting first would add chunks that are only needed later to the boot.
3. Paste the result back in as `PRELOAD`.

Keep the list as CheerpJ generates it. A hand-made "exact" list of byte ranges made CheerpJ
download more (18.6 MB against 16.0 MB), not less.

Keep `Forms` and `Px` free of `java.awt`: an AWT class on the web path would bring AWT's share of the runtime back.
`javap -v -cp out Forms | grep java/awt` should print nothing.

## Optimization log

What was tried, in order, and what it did. Times are cold first visits on a fast connection.

| #   | Change                                                                   | Result                                                  | Kept?                               |
| --- | ------------------------------------------------------------------------ | ------------------------------------------------------- | ----------------------------------- |
| 1   | Plain AWT app with hand-painted widgets, Java 8 bytecode, no lambdas     | baseline                                                | yes                                 |
| 2   | `preloadResources` from `cjGetRuntimeResources()`                        | ~6.5 s → ~4.3–4.6 s                                     | yes                                 |
| 3   | Picture of the form shown while Java boots                               | form visible in ms                                      | **no**, removed: not real rendering |
| 4   | `loader.js` loaded with `defer`                                          | page renders while the loader downloads                 | yes                                 |
| 5   | Timed each boot stage                                                    | JVM ~3.0 s, AWT ~0.2 s, first text ~1.1 s (font system) | –                                   |
| 6   | Load the TTF directly with `Font.createFont`                             | font cost still ~0.8 s, just moved                      | no                                  |
| 7   | Warm up fonts on a background thread                                     | no gain: CheerpJ runs Java threads in turn              | no                                  |
| 8   | Pre-rendered glyph table instead of the font system                      | ~4.3 s → ~3.3 s                                         | yes                                 |
| 9   | Network audit: every request and `Range` header                          | 98 requests / 16.4 MB; ~11.7 MB is the JVM itself       | –                                   |
| 10  | App classes in a package; `file.encoding` property                       | no change                                               | no                                  |
| 11  | Java 11 / 17 runtimes                                                    | fewer requests, slower start                            | no                                  |
| 12  | Hand-made "exact" preload ranges                                         | 18.6 MB instead of 16.0 MB                              | no                                  |
| 13  | `enableInputMethods(false)` in Forms                                     | −256 KB of `rt.jar`                                     | yes, until #27                      |
| 14  | CheerpJ `enableInputMethods: false` option                               | no change                                               | no                                  |
| 15  | `fillTri` and hand-drawn rounded buttons                                 | −384 KB of `rt.jar`; 16.0 → 15.2 MB                     | yes                                 |
| 16  | Throttled-network test                                                   | invalid: throttling doesn't reach CheerpJ's iframe      | –                                   |
| 17  | `20261016_3707` loader                                                   | ~3.2 s → ~2.9 s, 95 → 77 requests                       | yes                                 |
| 18  | `wasmGC: true`                                                           | ~2.9 s → ~2.6 s (no effect on 4.3)                      | yes, until #23                      |
| 19  | Dropped the custom overlay and the `natives` "ready" hook                | uses CheerpJ's own loading screen                       | yes, until #27                      |
| 20  | Labs page: jar fetched into `/str/` instead of `/app/`                   | works on hosts without `Range` support                  | yes                                 |
| 21  | Display fixed at 860×500                                                 | avoids the `wasmGC` scaled-image bug                    | yes                                 |
| 22  | Preload hints for `cj3.js`, `cj3.wasm`, `cj3n*.wasm`, `cheerpOS.js`, CSS | first JRE read ~580 → ~330 ms; ~0.2–0.35 s faster       | yes                                 |
| 23  | Java 11 / 17 again, on `20261016_3707` with their own preload lists      | ~2.5 s → ~1.7 s, 80 → 44 requests                       | yes (17)                            |
| 24  | `wasmGC` with Java 11 / 17                                               | hangs before the first frame                            | no                                  |
| 25  | Swing hello world for comparison (see below)                             | Swing adds ~3 MiB and ~0.4 s over AWT                   | –                                   |
| 26  | No-AWT prototype: library mode, Java fills a framebuffer, JS blits       | ~1.3 s, 31 requests, 8.9 MiB                            | –                                   |
| 27  | Forms ported off AWT: `Px` renderer, library mode, events from `main.js` | 1.68 s → 1.25 s, 44 → 31 requests, 13.5 → 8.95 MiB      | replaced by #28                     |
| 28  | Java runs the event loop and presents frames through `Web` natives       | same as #27 (1.30 s vs 1.37 s side by side)             | yes                                 |
| 29  | HiDPI: 2× framebuffer and a 24px glyph table                             | smooth text on Retina; ~50–70 ms more there, none at 1× | yes                                 |
| 30  | HTML/CSS loader with the CheerpJ wordmark and `preloadProgress`          | no measurable change (1.28 s vs 1.30 s)                 | yes                                 |
| 31  | `idleCallback` to take the loader down                                   | doesn't fire while Java waits in an async native        | no: first `present()` instead       |

## Comparison: Swing and the floor

Throwaway apps, each with its own preload list and the preload hints (medians of 5):

| App                                        | Java 8                       | Java 17                      |
| ------------------------------------------ | ---------------------------- | ---------------------------- |
| Empty `main()`                             | 1.45 s, 65 req, 10.1 MiB     | 1.12 s, 32 req, 8.9 MiB      |
| AWT Frame drawing one rectangle            | 2.19 s, 80 req, 13.6 MiB     | 1.90 s, 42 req, 13.5 MiB     |
| Swing: JFrame, JLabel, JButton, JTextField | 2.88 s, 100 req, 16.9 MiB    | 3.61 s, 71 req, 19.1 MiB     |
| Forms, AWT version                         | ~2.0–2.5 s, 80 req, 13.8 MiB | ~1.6–1.9 s, 44 req, 13.5 MiB |
| Forms, no AWT (current)                    | –                            | ~1.3 s, 31 req, 8.95 MiB     |

- The AWT version of Forms cost nothing measurable over a one-rectangle AWT frame: the cost was AWT itself.
- Swing is worse still: it's faster on Java 8 than 17, and on this build it doesn't start at all
  with `wasmGC: true` (the page's main thread blocks).
- The floor is the JVM: an empty `main()` on Java 17 is ~1.1–1.4 s and 8.9 MiB, and the current
  Forms downloads the same and starts about as fast.

Ideas not pursued:

- **Trim the CheerpJ runtime.** Even on Java 17 an empty `main()` reads ~8.9 MiB of the runtime,
  mostly from `lib/modules`. That's in the runtime's packaging, not in this repo.
