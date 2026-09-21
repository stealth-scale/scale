---
"@stealthscale/vite-plugin-theme": minor
---

Keep rendered configurations, codegen staging and the lock under the system's temporary directory,
so a build that reads and writes nothing of its own inside the workspace is cached. Generate under a
lock shared by the Vite plugin and the packer's plugin, and generate from the packer's plugin on its
first build where nothing generated yet. Replay pending stylesheet updates in order, keep one sheet
per environment, fail a build on a real error and keep the last good sheet in dev. Leave an authored
class inside a raw condition alone, match compound extensions against the inherited preset graph,
and watch every manifest the discovery read.
