---
"@stealthscale/vite-config-react": minor
---

- Add `plugin.icons()`, which imports each `lucide-react` icon from its own file.
- Exclude `*.specimen.tsx` from the refresh transform.
- Add `compiler: "build"`, which runs the React Compiler in builds only.
