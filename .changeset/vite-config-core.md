---
"@stealthscale/vite-config-core": minor
---

- Read only `STEALTH_*`, `VITE_*`, `CI`, `CI_COMMIT_SHA` and `GITHUB_SHA` from the environment.
- Skip `plugins` contributions while resolving metadata, and keep `pack.plugins`.
- Export `resolvingMetadata`, `appended` and `located`.
- Resolve a plugin package from the module that names it through `located`.
