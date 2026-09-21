---
"@stealthscale/vite-config-core": minor
---

Narrow the environment a layer reads to the `STEALTH_` and `VITE_` prefixes and the `CI`,
`CI_COMMIT_SHA` and `GITHUB_SHA` variables, so a task fingerprint no longer changes with the shell.
Pass over a `plugins` contribution while the toolchain resolves a configuration for its metadata,
and keep a `pack.plugins` contribution, because the packer reads its plugins under the same marker.
Export `resolvingMetadata`, `appended` and `located`; `located` resolves a plugin package from the
module that names it, so a configuration bundled from source loads the package from the right
`node_modules`.
