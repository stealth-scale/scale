---
"@stealthscale/vite-plugin-sbom": patch
---

- Match each package to the lockfile by name and manifest version.
- Remove credentials and the query from source URLs, and keep the commit fragment.
- Depend on `@cyclonedx/cyclonedx-library` 10.3.
- Peer on `vite` 8.3 and `vitest` 5.0.
