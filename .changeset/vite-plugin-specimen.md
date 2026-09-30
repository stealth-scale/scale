---
"@stealthscale/vite-plugin-specimen": minor
---

- Classify a property declared by a runtime dependency as an option.
- Add `Indexed.namespace`.
- Breaking: remove `virtual:specimen-fragments/<id>`, `Fragments`, `Indexed.fragments` and
  `Indexed.source`.
- Give every specimen its own hot update boundary, which dispatches `specimen:updated`.
- Name a page's chunk and its props chunk after the page.
- Write `Indexed.path` relative to the root.
- Write strings in generated modules through `quoted()`.
- Include a page chunk's dependencies recursively.
- Export `source` from every `*.example.tsx`.
- Read a factory's `*Props` type as a part.
