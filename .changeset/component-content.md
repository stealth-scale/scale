---
"@stealthscale/component-content": minor
---

- Add `CodeBlock` over `@tanstack/highlight`: `Root`, `Header`, `Title`, `Control`, `Content`,
  `Code`, `Copy`, with `size` and `mode`.
- Breaking: `CodeBlock.Copy` takes `label` and `copiedLabel` in place of `translations`.
- Scroll `CodeBlock.Content` in `ScrollArea`, named by the title or `label`.
- Breaking: `CodeBlock.Content` takes no `as`, and `CodeBlock.Title` takes no `id`.
- Add `before`, `CodeBlock.Diff` and `CodeBlock.DiffStat` over `diff` 9.0.0.
- Render terminal output for `language="ansi"`, and copy it without escapes.
- Add `CodeBlock.parseAnsi` and `CodeBlock.stripAnsi`.
- Add a `wrap` axis to `CodeBlock`.
- Add `JsonTreeView` over `@zag-js/json-tree-utils` and the collections `TreeView`.
- Add `Marquee` over `@zag-js/marquee` with `PauseTrigger`, `PauseIndicator` and `gap`.
- Add `Markdown` over `@tanstack/markdown` 0.0.15, rendered with the library's components.
- Mark a `streaming` Markdown document `aria-busy` and render a caret.
- Depend on `component-actions` and `component-collections`, and peer on `component-primitives`.
- Add a specimen per component.
