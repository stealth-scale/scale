---
"@stealthscale/vite-plugin-i18n": patch
---

Treat a package built or tested under its own root as a package: the keys its own catalogues add to
a namespace another package ships are what it defines, not an application's typo. The root is the
application where its manifest is private.
