---
"@stealthscale/vite-config-specimen": minor
---

- Breaking: `layers(files)` replaces `uncounted`.
- Exclude `**/*.example.tsx` from coverage in `layers()`.
- Add `specimen.example.uncounted` and `specimen.example.undocumented` to `workspace()`.
- Add `uncapped(files)`, which turns off `import/max-dependencies` for example files.
- Peer on `vite` 8.3.
