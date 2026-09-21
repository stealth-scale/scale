---
"@stealthscale/vite-plugin-specimen": patch
---

Write the pages chunk and the props chunk under a build alone. The pages group holds each page's
dependencies, so a component the entry also reaches is bundled with them, and the entry's own chunk
then imports the pages chunk and runs it first. The React plugin writes its refresh preamble into
the document, and a dev server that bundles folds that preamble into the entry's chunk, so a
component in the pages chunk read the refresh runtime before the preamble installed it and threw. No
catalogue page rendered anything. Both chunks are a caching measure for a reader, and a dev server
has no reader to cache for, which is the same reason `build.chunks` leaves its library and shared
groups out of a dev server.
