# CheerpJ tutorial packaging

Use `package-cheerpj-tutorial.mjs` to build a downloadable tutorial ZIP from a source example folder.

This will:

- copy the example folder to a temp directory,
- remove empty `.jar` files,
- replace the loader URL in HTML files,
- writes a ZIP at the requested output path.

Typical usage:

```sh
node scripts/package-cheerpj-tutorial.mjs \
  --source ../cheerpj-meta/examples/SwingSet3 \
  --output sites/cheerpj/public/cheerpj3/tutorials/swingset3-template.zip \
  --loader-url https://cjrtnc.leaningtech.com/4.3/loader.js
```

If the HTML source uses a placeholder instead of a hardcoded loader URL, the default placeholder is `__CHEERPJ_LOADER_URL__`.