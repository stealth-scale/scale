---
"@stealthscale/vite-plugin-base": minor
---

vite-plugin-base: add quoted

- `quoted(text)` writes a string as a JavaScript string literal: JSON's escaping, plus the line and
  paragraph separators as unicode escapes, which JSON leaves bare and a code scanner reads as
  unsanitised code. `literal()` writes every string and key through it.
