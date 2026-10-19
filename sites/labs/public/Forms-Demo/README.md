# CheerpJ Forms demo

A Forms/EBS-style purchase order screen in Java, built to boot as fast as possible under CheerpJ.
It's a single plain AWT class: no Swing, no JavaFX, no dependencies, ~20 KB jar. Every pixel is
drawn by Java at runtime; there are no placeholder images or other loading tricks.

## At a glance

Cold first visits, from navigation start to the first frame painted:

|                                      | Time       | Requests | Download     |
| ------------------------------------ | ---------- | -------- | ------------ |
| First Forms version (4.3 loader)     | ~4.3 s     | ~97      | ~16.0 MB     |
| **Now** (`20261016_3707` + `wasmGC`) | **~2.7 s** | **~78**  | **~13.9 MB** |

The current page measured 2.63 / 2.80 / 2.73 s. Nearly all that's left is CheerpJ's JVM booting:
an empty `main()` alone needs ~11.7 MB, and Forms paints ~0.3 s after `main()` starts.

| File                  | What it is                                                                       |
| --------------------- | -------------------------------------------------------------------------------- |
| `src/Forms.java`      | the whole app                                                                    |
| `tools/GlyphGen.java` | build-time tool that generates the glyph table (see below)                       |
| `build.sh`            | builds `forms.jar` (`javac --release 8`)                                         |
| `index.html`          | the embed page; the `#java-demo` div (860×500) is the part to copy into the site |
| `forms.jar`           | the built app, so the page runs without a build                                  |

`build.sh` needs the Liberation Sans TTFs, by default from `/usr/share/fonts/liberation-sans-fonts`;
set `FONTS=/path` if they live elsewhere.

## Labs preview

The demo is also on the `Forms-Demo` branch of [leaningtech/labs](https://github.com/leaningtech/labs),
in `sites/labs/public/Forms-Demo/`, laid out like the `FlatLaf-Demo` branch: `index.html`,
`main.js`, `style.css`, the jar in `Forms/` and this README. PRs there get a Cloudflare Pages preview.

Cloudflare Pages ignores `Range` requests, which CheerpJ needs to read a jar from `/app/`. So
`main.js` fetches `forms.jar` whole (20 KB) and hands it to CheerpJ's in-memory filesystem with
`cheerpOSAddStringFile("/str/forms.jar", …)`, then runs `/str/forms.jar`. FlatLaf writes its jars
to `/files/` through library mode instead; `/str/` avoids starting Java's file I/O before the form.

## Run locally

    ./build.sh
    npx http-server -p 8080 -c-1     # the server MUST support Range requests (python -m http.server doesn't)
    open http://localhost:8080/

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

Everything, including the widgets, is painted by hand on one Canvas. Real AWT/Swing components
would make CheerpJ load much more of the JRE, and this way it looks the same everywhere.

## Why it boots fast

- **AWT only, custom painting.** Swing and JavaFX make the JVM load (and CheerpJ download) many more classes.
- **No lambdas, Java 8 bytecode.** Lambdas and Java 9+ string concatenation use
  `invokedynamic`, which pulls in `java.lang.invoke`. Java 8 is also CheerpJ's default runtime.
- **`preloadResources`.** The runtime chunks the app needs are listed up front, so CheerpJ
  fetches them in parallel and doesn't discover them one at a time.
- **No font system before the first frame** (see below).
- **No JRE code beyond what a one-rectangle AWT app needs** (see below).
- **`loader.js` is deferred**, so it doesn't block the page from rendering.
- **CheerpJ build `20261016_3707` with `wasmGC: true`** (see below).
- **No custom loading overlay.** CheerpJ shows its standard loading animation until Java paints,
  so the page needs no native callback.

## No font system at startup

Starting Java's font system (sun.font, TrueType parsing) costs ~1 s of CPU in CheerpJ the first
time any text is drawn. Forms skips it: `tools/GlyphGen.java` runs at build time and pre-renders
Liberation Sans 12px regular and bold (the font CheerpJ uses) for ASCII into a generated
`Glyphs` class. At runtime, `Forms.text()` draws strings from those glyphs. It's still live Java
rendering: every frame and every typed character is drawn by Java. A character outside the
table (é, €, …) falls back to the real font, which loads the font system the first time.

Measured on cold first visits with the 4.3 loader and preloading, from navigation start to the first frame painted:

|                                                         | Time   |
| ------------------------------------------------------- | ------ |
| JVM boot until `main()` runs (same for an empty `main`) | ~3.0 s |
| Forms with the normal font system                       | ~4.3 s |
| Forms with the glyph table                              | ~3.3 s |

Trade-offs: the jar grew from 14 KB to 20 KB and the table is for one font size. The form scales to
fit its display, but keep the display at 860×500: scaled glyphs look a little softer than real
fonts, and with `wasmGC` on the current loader they don't draw at all (see Known issues).

## Loader and `wasmGC`

`index.html` uses the `20261016_3707` CheerpJ build with `wasmGC: true`. Cold loads of Forms, each
setup with a preload list recorded on that setup (3 runs each, first frame painted):

| Setup                      | Time   | Requests | Download |
| -------------------------- | ------ | -------- | -------- |
| 4.3                        | 3.17 s | 95       | 15.24 MB |
| 4.3 + `wasmGC`             | 3.09 s | 95       | 15.24 MB |
| `20261016_3707`            | 2.91 s | 77       | 13.62 MB |
| `20261016_3707` + `wasmGC` | 2.60 s | 78       | 13.87 MB |

On 4.3, `wasmGC` made no difference to the download and the time difference is noise.
To go back, set `wasmGC: false` (~0.3 s slower) or the 4.3 loader, and regenerate the preload list.
See Known issues for what `wasmGC` breaks on this build.

## Where the download goes

Measured on the 4.3 loader: a cold load of Forms is ~95 requests and ~15.2 MB. Almost all of it is the JVM itself, from
CheerpJ's CDN (HTTP/2, cached for a year, `Range` reads in 128 KB pieces):

| App                             | Requests | Download |
| ------------------------------- | -------- | -------- |
| Empty `main()`                  | 83       | 11.7 MB  |
| AWT Frame drawing one rectangle | ~95      | ~15.2 MB |
| Forms                           | ~95      | ~15.2 MB |

The empty `main()` already reads ~8.3 MB of `rt.jar`, including its 1.9 MB central directory,
plus parts of `jsse`, `jce`, `charsets`, `resources` and `javaws`. Packages, system properties
and the preload format don't change that. Java 11/17 make fewer requests but started slower here.

Forms used to add 5 more `rt.jar` chunks (640 KB). Bisecting found two causes, both fixed:

- `addKeyListener` on a focused component starts AWT's input method framework (`sun.awt.im`,
  Swing popup classes, ~256 KB). Forms only reads plain key events, so it calls
  `enableInputMethods(false)`. The CheerpJ `enableInputMethods: false` option did not avoid it.
- `fillPolygon`, and `fillRoundRect`/`drawRoundRect` with a gradient, go through Java2D's general
  shape rasterizer (~384 KB). The arrow triangles (`fillTri`) and the rounded buttons are drawn
  from `fillRect`/`drawLine` instead and look the same. Plain rects, lines, gradients on rects,
  `BasicStroke`, alpha, clipping and images don't pull in anything extra.

When adding drawing code, check that a cold load's `rt.jar` requests don't grow (DevTools,
Network tab, filter `rt.jar`; the requests come from CheerpJ's `c.html` iframe).

## Known issues

- **`wasmGC` drops burst keystrokes.** On `20261016_3707` with `wasmGC: true`, keys arriving in
  a burst (synthetic, 0 ms apart) right after a field change lose characters: 3 of 3 runs.
  At 20 ms per key it was complete every time, and with `wasmGC: false` even the burst was fine.
  Forms' code is identical in all cases, so this is in CheerpJ's `wasmGC` event handling.
  Normal typing shouldn't hit it; very fast typists or tools that send keys in bulk might.
- **`wasmGC` breaks scaled images.** On `20261016_3707` with `wasmGC: true`, any `drawImage`
  under a scale transform draws nothing, so a form shown at any size other than 860×500 has no
  text. Drawing the frame 1:1 and scaling the whole image made it worse (nothing drew). Both
  pages keep the display at exactly 860×500; 4.3 and `wasmGC: false` scale fine.
- **`wasmGC` ignores `natives`.** With `wasmGC: true` on this build, functions passed in the
  `natives` option are never called. The page doesn't use any, so it isn't affected.
- **Preview build.** `20261016_3707` appears to be a dated preview build, not a release like 4.3.
- **License.** The page shows the CheerpJ Community Edition banner. On a business site, pass
  `licenseKey` to `cheerpjInit`.

## If you change the Java code

Regenerate the preload list:

1. Set `preloadResources: {}` in `index.html` and load the page in a fresh (e.g. incognito) window.
2. Once the form is on screen, and _without_ clicking or typing, run `cjGetRuntimeResources()` in
   the browser console. Interacting first would add chunks that are only needed later to the boot.
3. Paste the result back in as `preloadResources`.

Keep the list as CheerpJ generates it. A hand-made "exact" list of byte ranges made CheerpJ
download more (18.6 MB against 16.0 MB), not less.

## Optimization log

What was tried, in order, and what it did. Times are cold first visits on a fast connection.

| #   | Change                                                               | Result                                                  | Kept?                               |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------- |
| 1   | Plain AWT app with hand-painted widgets, Java 8 bytecode, no lambdas | baseline                                                | yes                                 |
| 2   | `preloadResources` from `cjGetRuntimeResources()`                    | ~6.5 s → ~4.3–4.6 s                                     | yes                                 |
| 3   | Picture of the form shown while Java boots                           | form visible in ms                                      | **no**, removed: not real rendering |
| 4   | `loader.js` loaded with `defer`                                      | page renders while the loader downloads                 | yes                                 |
| 5   | Timed each boot stage                                                | JVM ~3.0 s, AWT ~0.2 s, first text ~1.1 s (font system) | –                                   |
| 6   | Load the TTF directly with `Font.createFont`                         | font cost still ~0.8 s, just moved                      | no                                  |
| 7   | Warm up fonts on a background thread                                 | no gain: CheerpJ runs Java threads in turn              | no                                  |
| 8   | Pre-rendered glyph table instead of the font system                  | ~4.3 s → ~3.3 s                                         | yes                                 |
| 9   | Network audit: every request and `Range` header                      | 98 requests / 16.4 MB; ~11.7 MB is the JVM itself       | –                                   |
| 10  | App classes in a package; `file.encoding` property                   | no change                                               | no                                  |
| 11  | Java 11 / 17 runtimes                                                | fewer requests, slower start                            | no                                  |
| 12  | Hand-made "exact" preload ranges                                     | 18.6 MB instead of 16.0 MB                              | no                                  |
| 13  | `enableInputMethods(false)` in Forms                                 | −256 KB of `rt.jar`                                     | yes                                 |
| 14  | CheerpJ `enableInputMethods: false` option                           | no change                                               | no                                  |
| 15  | `fillTri` and hand-drawn rounded buttons                             | −384 KB of `rt.jar`; 16.0 → 15.2 MB                     | yes                                 |
| 16  | Throttled-network test                                               | invalid: throttling doesn't reach CheerpJ's iframe      | –                                   |
| 17  | `20261016_3707` loader                                               | ~3.2 s → ~2.9 s, 95 → 77 requests                       | yes                                 |
| 18  | `wasmGC: true`                                                       | ~2.9 s → ~2.6 s (no effect on 4.3)                      | yes                                 |
| 19  | Dropped the custom overlay and the `natives` "ready" hook            | uses CheerpJ's own loading screen                       | yes                                 |
| 20  | Labs page: jar fetched into `/str/` instead of `/app/`               | works on hosts without `Range` support                  | yes                                 |
| 21  | Display fixed at 860×500                                             | avoids the `wasmGC` scaled-image bug                    | yes                                 |

Ideas not pursued:

- **Drop AWT** and have Java draw through a small JavaScript bridge to an HTML canvas. That would
  save ~3.5 MB and about a dozen requests, but it's a rewrite of the drawing layer. Not measured.
- **Trim the CheerpJ runtime.** An empty `main()` reads the 1.9 MB `rt.jar` index and parts of five
  jars the app never uses (~2.2 MB). That's in the runtime's packaging, not in this repo.
