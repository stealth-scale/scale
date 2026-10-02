---
"@stealthscale/vite-plugin-product": minor
---

- Add the package.
- Add `product()`, which composes a product from its definition while it builds.
- Find each installed plugin's web package and contract package among the modules the definition
  loaded.
- Count the product's own package among its dependencies.
- Assign a manifest no loaded module exports to the package of the definition module.
- Add the `standalone` option, which writes a plugin's standalone definition and serves its page.
- Check every key against the words `vite-plugin-i18n` found, and each command's keys with
  `@tanstack/hotkeys`.
- Serve `virtual:product`, and declare it in `@stealthscale/vite-plugin-product/client`.
- Fail a build on a problem, and print each warning.
- Build each plugin's lazy modules into a chunk named `plugin-<id>`.
- Write `.product/access.json`, `.product/flags.json` and `.product/operations.json` in a client
  build.
- Compose the product again after a change, then reload the page or show the problems in the error
  overlay.
- Run one composition at a time after changes, and skip a change that a later change superseded.
- Compose through one environment, and transform only the changed files before composing again.
- Depend on `@tanstack/hotkeys` 0.10.0.
