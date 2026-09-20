---
"@stealthscale/vite-config-react": minor
---

vite-config-react: import each icon from its own file

- `react.layers()` carries `plugin.icons()`, which rewrites a named import from `lucide-react` into
  one import per icon file under `dist/esm/icons`, before anything else reads the source. A build
  tree-shakes the root down to the icons a page draws, but a dev server does not: the
  module-per-file server pre-bundles the root whole, five megabytes for every document that imports
  one icon, and the bundling server carries every icon in its vendor chunk. The catalogue's vendor
  chunk holds six icons and 1.4 MB now, rather than 1849 and 4.3 MB.
- The file an identifier stands for is a spelling rule, checked against the resolver once per name:
  `Grid2X2Icon` is `grid-2-x-2` and `Grid2x2` is `grid-2x2`, and the set publishes a file under
  every alias. A name no icon file answers to, and a type, stay on the root import or are dropped,
  so `createLucideIcon` and `LucideIcon` still resolve.

vite-config-react: leave a specimen out of the refresh transform

- A `*.specimen.tsx` file is excluded from the React plugin's refresh transform. Its JSX still
  compiles, because the plugin sets the JSX transform for every file in its configuration. A
  specimen exports scenes and constants beside its components, which the refresh runtime read as a
  module it could not refresh and invalidated on every edit, undoing the boundary the specimen
  plugin gives the file.

vite-config-react: compile under a build alone where asked

- `react.layers({ compiler: "build" })`, or `compiler: { only: "build" }`, runs the React Compiler
  under a build and leaves a dev server's transforms to the JSX plugin. The compiler is most of what
  a cold dev transform costs, 1.7 seconds of a catalogue page's 2.2. What a package gives up is the
  compiler's reading of its components while it edits them, so the default keeps it on.
