---
"@stealthscale/vite-plugin-base": minor
---

- Add `quoted(text)`, which writes a string as a JavaScript string literal.
- Write every string and key in `literal()` through `quoted`.
- Peer on `vite` 8.3 and `vitest` 5.0.
- Add `Imported.loaded`: every module an import evaluated, with its namespace, in evaluation order.
- Add `Importer.invalidate(files)`, which drops the transforms of the files given and every
  evaluated module.
