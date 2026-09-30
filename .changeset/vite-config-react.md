---
"@stealthscale/vite-config-react": minor
---

- Exclude `*.example.tsx` from Fast Refresh in `plugin.refresh()`.
- Run the React Compiler through `oxc-transform-react` in place of the Babel bridge.
- Drop the `@rolldown/plugin-babel` and `babel-plugin-react-compiler` peers.
- Peer on `oxc-transform-react` 0.151.
- Peer on `vite` 8.3 and `vitest` 5.0.
