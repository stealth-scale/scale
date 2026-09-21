---
"@stealthscale/vite-plugin-i18n": patch
---

Write no loader for a language the catalogues module inlines. The runtime reads an inlined language
from the bundle and never calls its loader, and the loader made the bundler write every pair of that
language as a chunk beside the same words inlined.
