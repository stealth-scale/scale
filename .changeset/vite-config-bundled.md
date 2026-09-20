---
"@stealthscale/vite-config": minor
---

vite-config: serve an application from one bundle in development

- `server.bundled()` turns on Vite's full bundle mode for a dev server, and the application preset
  carries it, so every application is served from a handful of chunks rather than one module per
  file. The catalogue's page loaded in 729 requests and 19 MB before and in nine requests after, and
  a frame the page opens loads in eight, from the browser's cache. A specification run is left
  serving one module per file, because the runner reads one file at a time and a bundled server
  parses a setup file another package publishes as plain script.
- Vite marks the mode experimental. A hot update is computed in the browser from what ran rather
  than on the server from the graph, and a plugin's hot update hook is handed no environment, which
  the house plugins allow for.

vite-config: split the house's own packages into a library chunk

- `build.chunks()` groups the components, the foundations, the themes and the tooling a page runs
  into a `library` chunk, beside the `framework`, `vendor` and `app` chunks a build already wrote,
  whether they resolved to their source beside the application or were installed under the house
  scope. The library changes at another pace than the application drawn with it, so a deploy that
  touched a page alone leaves the library chunk's name, and the browser's copy of it, as they were.
  The catalogue's first load is the same 240 kB gzipped, now as 66 kB of framework, 90 of vendor, 56
  of library and 26 of the application.
- A module is placed by its own path alone. The bundler would otherwise pull everything a matched
  module imports into the same group, and the library's dependencies followed it out of the vendor
  chunk.
- A dev server keeps the three-way split, because it groups its chunks the way a build does and its
  React refresh runtime is a module of the application's chunk: a library chunk ran before it and
  every component called a runtime not yet set up, which was a white page.
