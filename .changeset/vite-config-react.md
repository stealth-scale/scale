---
"@stealthscale/vite-config-react": minor
---

vite-config-react: skip Fast Refresh for example files

- `plugin.refresh()` adds `/\.example\.tsx$/` to `exclude`, next to the specimen pattern. JSX in an
  example file still compiles.
- The specimen plugin appends a `source` string export to each example, and the refresh runtime
  rejects such a module as a boundary. The bundled dev server turned that invalidation into a full
  page reload on every example edit. With the exclusion, the edit reached the importing specimen and
  applied without a reload on the tag page.
