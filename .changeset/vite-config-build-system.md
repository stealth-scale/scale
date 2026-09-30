---
"@stealthscale/vite-config": minor
---

- Load the inventory plugin when the plugin is constructed, not when the tier is imported.
- Run `pack.hook()` moments on every bundle of a `pack` list.
- Write `define.manifest()` constants for the packer as well as for Vite.
- Derive `pack.published()` entries for a package that is its own root.
- Set the `node` platform in `pack.preset.node()`.
- Add `pack.builtins()`, which `pack.preset.web()` uses to refuse Node built-ins.
- Remove the `app` group from `build.chunks()`.
- Raise the spec size limit to 900 lines.
- Re-export `located` and `resolvingMetadata`.
