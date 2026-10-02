---
"@stealthscale/vite-config": minor
---

- Add `server.bundled()`, full bundle mode for dev servers, on by default in the application preset.
- Bundle every dynamic import when the dev server starts.
- Add a `library` chunk to `build.chunks()` for the house packages.
