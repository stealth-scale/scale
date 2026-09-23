---
"@stealthscale/testing-config": minor
---

testing-config: skip example files in the source checks

- `source.specs` and `source.declared` skip `*.example.tsx`, next to spec, fixtures and specimen
  files. An example runs in the catalogue and resolves its imports through the workspace root.
