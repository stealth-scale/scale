---
"@stealthscale/vite-plugin-base": minor
---

- Add `withLock`, a cross-process lock directory with an owner, a grace period and a wait.
- Add `scratchDir`, a plugin's scratch directory outside the workspace.
- Write generated files through a staged rename.
- Stop a directory sync on a source that cannot be listed.
- Resolve export maps in Node's order and `node_modules` to a package's real directory.
- Key lockfile records by `name@version`, and add `installedOf`.
- Split a lockfile key at the first `@` after its first character.
