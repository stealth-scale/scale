---
"@stealthscale/vite-plugin-specimen": minor
---

List a stamp file as a file the index watches, and rewrite it from `watchChange` under a server that
bundles when a specimen appears, disappears or changes the metadata it declares, so the index is
generated again on the next rebuild without a restart. Import the compiler's type through the types
module, so a catalogue that reads no props loads no compiler.
