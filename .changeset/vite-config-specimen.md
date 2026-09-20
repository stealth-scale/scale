---
"@stealthscale/vite-config-specimen": minor
---

vite-config-specimen: take the specimen globs on layers

- `layers(files)` stops counting the files a package names, `**/*.specimen.tsx` by default. It is
  the one entry for a package that holds specimens, and `uncounted` is no longer exported.
- The specimen glob and the renaming of a borrowed contribution are stated once, in `specimens.ts`,
  rather than in three files.
