---
"@stealthscale/vite-config": minor
---

- Exclude the root's `.scratch` directory from test and coverage globs.
- Test each inventory layer's options against a fixture instead of loading the plugin.
- Add `lint.registered(files)`, which turns off `import/max-dependencies` for `**/src/theme.ts`.
