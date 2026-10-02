---
"@stealthscale/vite-config": minor
---

- Exclude the root's `.scratch` directory from test and coverage globs.
- Match a module under `sdk` in the `library` and `shared` chunk groups.
- Test each inventory layer's options against a fixture instead of loading the plugin.
- Add `lint.registered(files)`, which turns off `import/max-dependencies` for `**/src/theme.ts`.
- Check packed types with attw's `esm-only` profile.
- Exclude the repository's copies from tests and coverage by globs relative to the root.
- Peer on `@module-federation/vite` 1.22, `eslint-plugin-jsdoc` 64.5 and
  `eslint-plugin-perfectionist` 5.12.
- Peer on `vite` 8.3, `vitest` 5.0, `@vitest/browser-playwright` 5.0.1 and `@vitest/coverage-v8`
  5.0.1.
