---
"@stealthscale/vite-config": minor
---

Add a `shared` chunk to `build.chunks()`: what several lazily loaded routes reach and the entry does
not is one chunk, fetched once, rather than a chunk per set of routes or the chunk of whichever
route the bundler met first with every other route importing it.
