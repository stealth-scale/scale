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
- Read each module a specimen and its examples import once.
- Classify each declaration's file once per package.
- Read a package's dependencies once per compiler.
- Ask the compiler for no call signatures of literal and intrinsic types.
- Read every page in one program for each set of compiler options.
- Keep each page's props on disk under Vite's `cacheDir`, keyed by the page's package, the workspace
  packages it builds on, the lockfile and the reader.
- Stop the compiler a minute after a dev server's last read.
- Keep the part of the module beside the specimen where two modules export one name.
- Leave a class's private members out of `shapes`.
- Peer on `vite` 8.3.
