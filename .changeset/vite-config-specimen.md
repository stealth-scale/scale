---
"@stealthscale/vite-config-specimen": minor
---

vite-config-specimen: take the specimen globs on layers

- `layers(files)` stops counting the files a package names, `**/*.specimen.tsx` by default. It is
  the one entry for a package that holds specimens, and `uncounted` is no longer exported.
- The specimen glob and the renaming of a borrowed contribution are stated once, in `specimens.ts`,
  rather than in three files.

vite-config-specimen: exempt example files from coverage and doc comments

- `layers()` excludes `**/*.example.tsx` from coverage next to the specimen files.
- `workspace()` adds `specimen.example.uncounted` for coverage and `specimen.example.undocumented`
  for the doc comment rules, both over `**/*.example.tsx`.
