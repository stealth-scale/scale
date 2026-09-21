---
"@stealthscale/vite-plugin-base": minor
---

Add `withLock`, which holds a lock directory across processes with a recorded owner, a grace and a
wait, and `scratchDir`, which names a plugin's scratch outside the workspace. Write a generated file
through a staged rename, and stop a directory sync on a source that cannot be listed. Resolve an
export map in Node's order, walk `node_modules` to a package's real directory, and key a lockfile by
`name@version` with `installedOf` picking the record an installation matches. Cut a lockfile key at
the first `@` past its opening character, so an alias and an address with a credential stay whole on
the version's side.
