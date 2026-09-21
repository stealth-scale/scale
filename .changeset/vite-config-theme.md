---
"@stealthscale/vite-config-theme": minor
---

Load the theme plugin when a plugin is constructed rather than when the layer is stated. State the
packer's runtime plugin as an override that hands it the conditions the presets resolved with, so a
pack of a checkout nothing generated in generates the runtime from the preset's source before it
resolves an import. Drop the cache layer: the plugin keeps its scratch outside the workspace now.
