---
"@stealthscale/vite-plugin-theme": minor
---

- Keep rendered configurations, codegen staging and the lock in the system temp directory.
- Generate under one lock shared by the Vite plugin and the packer plugin.
- Generate from the packer plugin on its first build when nothing is generated yet.
- Replay pending stylesheet updates in order, and keep one sheet per environment.
- Fail a build on an error, and keep the last good sheet in dev.
- Leave an author's class inside a raw condition unchanged.
- Match compound extensions against the inherited preset graph.
- Watch every manifest that discovery reads.
