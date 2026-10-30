# Diagram sources

Editable SVG sources for the CheerpJ docs diagrams. The PNGs that the docs
actually reference are exported from these — edit the SVG, re-export, commit
both.

| Source               | Exported PNG                                        | Canvas    |
| -------------------- | --------------------------------------------------- | --------- |
| `overview.svg`       | `src/content/docs/explanation-diagram.png`            | 2000×1000 |
| `architecture.svg`   | `public/cheerpj3/assets/cheerpj-3-arch.png`           | 2000×1340 |
| `networking.svg`     | `public/cheerpj3/assets/general_networking.png`       | 2000×1380 |
| `server-client.svg`  | `public/cheerpj3/assets/Tailscale_P2P.png`            | 2000×1040 |

`public/cheerpj3/assets/JRE.png` and `public/cheerpj3/assets/filesystem.png`
have no source here — they were only edited as pixels (rounded corners, and on
the file system one a redrawn fetch arrow), so the PNG is still the original
artwork.

Nothing in this directory is published: Astro only serves `public/` and
processes `src/`.

## Fonts

The diagrams use the same two faces as the site:

- **Monaspace Argon** — referenced by relative path from
  `packages/astro-theme/public/fonts/monaspace/`, so there is no second copy.
- **Stack Sans Text** — `fonts/StackSansText-latin.woff2`, the latin subset
  Google Fonts serves. SIL Open Font License 1.1, see `fonts/OFL.txt`.

The relative `url()` references resolve when the SVG is opened straight from
disk, so the files render correctly in a browser with no server.

## Exporting

Each PNG is rendered at 3× the canvas (the overview one at 2×), quantised to a
palette, and has its fully-transparent palette entry forced to alpha 0 — the
quantiser otherwise emits alpha 1–4, which is invisible but not actually
transparent. The flat two-colour artwork palettes extremely well: every export
came out smaller than the hand-drawn PNG it replaced, despite 2–3× the pixels.

```bash
# 1. render (adjust --window-size to the canvas, scale factor to taste)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=10000 \
  --force-device-scale-factor=3 --default-background-color=00000000 \
  --screenshot=out.png --window-size=2000,1340 "file://$PWD/architecture.svg"
```

```bash
# 2. quantise
node -e "require('sharp')('out.png').png({palette:true,colors:128,compressionLevel:9,effort:10}).toFile('out-pal.png')"
```

```bash
# 3. force the transparent palette entry to alpha 0
python3 - <<'EOF'
import struct, zlib
d = open('out-pal.png','rb').read()
out = bytearray(d[:8]); i = 8
while i < len(d):
    ln = struct.unpack('>I', d[i:i+4])[0]; typ = d[i+4:i+8]; data = d[i+8:i+8+ln]
    if typ == b'tRNS':
        data = bytes(0 if b <= 10 else b for b in data)
    c = typ + data
    out += struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c))
    i += 12 + ln
open('out-pal.png','wb').write(bytes(out))
EOF
```

## Conventions

Shared across all of them, worth keeping if you add more:

- Palette: ink `#1e1e1e`, cream `#efe9e9`, sage `#e5e5d6`, orange `#ff7c00`.
- Sage background with a 40px corner radius and transparency outside it, so the
  diagrams sit on the dark docs page without a hard rectangle.
- Hard drop shadows, no blur: solid ink (or orange on dark blocks) offset down
  and right.
- Section labels are mono caps with a small orange square; connector labels are
  mono pills sitting on the arrow.
