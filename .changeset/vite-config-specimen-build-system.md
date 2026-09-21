---
"@stealthscale/vite-config-specimen": patch
---

Load the specimen plugin when the plugin is constructed rather than when the layer is stated, from
the module that names it, so reading a configuration for its metadata loads no plugin and a checkout
whose tooling is not built yet can still plan its build.
