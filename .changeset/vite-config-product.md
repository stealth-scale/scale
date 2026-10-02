---
"@stealthscale/vite-config-product": minor
---

- Add the package.
- Add `layers()`, with the product plugin and the definition module's default export excused.
- Add `composed()`, which appends the product plugin.
- Add `lint.plugin.contract()`, which refuses a contract every import but `sdk-core`, other
  contracts, its own modules and a Standard Schema library.
- Add `lint.plugin.web()`, which refuses `sdk-host` to a web package and a static import of a
  component module to its manifest entry.
- Add `standalone()`, which serves a plugin's standalone page under `vp dev`.
- Peer on `vite-config-theme`.
