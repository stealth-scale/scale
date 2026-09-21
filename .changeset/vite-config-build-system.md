---
"@stealthscale/vite-config": minor
---

Load the inventory plugin when the plugin is constructed rather than when the tier is imported.
Schedule `pack.hook()` moments on every bundle of a `pack` list and after a registrar another layer
wrote. Write `define.manifest()` constants for the packer as well as for Vite. Derive
`pack.published()` entries for a package that is its own root. State the `node` platform in
`pack.preset.node()`, and refuse a Node built-in at the pack in `pack.preset.web()` through the new
`pack.builtins()`. Drop the catch-all `app` group from `build.chunks()`, so each entry keeps the
modules it reaches. Raise the spec size limit to 900 lines. Re-export `located` and
`resolvingMetadata` from the kernel.
