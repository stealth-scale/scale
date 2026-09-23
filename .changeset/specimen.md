---
"@stealthscale/specimen": minor
---

specimen: list a sample's looks in the order the library reads them

- `Sample`'s `variant` runs from the loudest look down rather than alphabetically. The styles each
  look draws are unchanged.

specimen: build a page's scenes from its recipe

- `scenesOf(recipe, options)` returns one scene per axis the recipe offers. An axis gets a scene
  unless the page states a reason it gets none, so an axis added to a recipe reaches its page
  without anybody remembering to write one. Measured across the library on 2026-09-21, eleven of two
  hundred and ten axes were drawn by nothing.
- A page hands over one drawing and the words' namespace. Per axis it may cross a second axis, hold
  props fixed, run the cells down the page, or swap the drawing. An axis another scene crosses gets
  no scene of its own unless the page states something for it.
- `Scene` takes `axes`, naming the axes a scene draws, and `source`, the snippet the catalogue
  shows. A scene that states none is drawn without a source control.
- `written(snippet, props)` writes the component as a consumer writes it: the import above, every
  prop the cell is drawn with, and the children indented. A scene the generator did not build writes
  its source the same way.
- `uncovered(recipe, scenes, { skip })` reports an axis no scene draws and a skip naming an axis the
  recipe no longer offers.
- `stale(recipe, scenes)` reports a stated source naming a value its axis no longer offers, which is
  the one way a hand-written snippet drifts from the recipe.

specimen: take the import line off the index and put it on the page

- `Specimen` takes `imports`, the statement the page opens with, and the page draws no import line
  where it states none. The kit read that statement off `Fragments.imported`, which the index built
  by parsing the file's own imports, and a namespaced component came out as its parts: the
  accessibility package's roving focus listed `Item, Root` rather than `RovingFocus`.
- `Fragments`, `useLoadedPage` and `Loaded` are gone, and a page loads its module alone.
  `useDeclared` is what a caller uses, and `Specimen.imports` reaches it through `declared()`.
- A scene's source is the one the scene carries. `SceneSectionProps.source` is `null | string` and
  no longer has a state for sources that have not arrived.

specimen: set the neutral palette on the scene footer buttons

- The audit button and the source toggle in a scene's footer set `palette="neutral"` in place of
  `status="neutral"`, after `@stealthscale/component-actions` replaced the button's `status` axis
  with `palette`.

specimen: show an example file as the source of a scene

- `Scene.example` takes the namespace of an example module. When the scene states no `source`, the
  catalogue shows the module's `source` export. `sourceOf(scene)` returns that text.
- `scenesOf` takes `example` at page level and per axis, ahead of `sample`. `propped(source, props)`
  writes the props of the first cell in place of every `{...props}` spread and removes the `props`
  parameter, so a generated scene shows `<Tag.Root palette="primary" variant="solid">`.

specimen: name props band parts after the page ID

- The props band heads each part with the namespace from the page ID, `namespaceOf(id)`, so the tag
  page reads `Tag.CloseTrigger`. It read `tag.title.CloseTrigger`, because page titles are
  translation keys.
- A part whose name contains the namespace is a standalone component: `ColorSwatchMix`,
  `LoaderOverlay` and `IconButton` in place of `ColorSwatch.ColorSwatchMix`, `Loader.LoaderOverlay`
  and `Button.IconButton`.

specimen: write the props of a hand-written scene into its example

- `Scene.props` holds the props of the first cell of a hand-written scene. `sourceOf()` writes them
  into the example's `{...props}` spreads and removes the `props` parameter, so a `Matrix` scene
  shows `<Button aria-pressed variant="solid">`.
- `propped()` removes a `props` parameter that the formatter wraps onto several lines. A spread on a
  line of its own keeps its indent, and the line is removed when no prop is set.
- The catalogue's code view passes `label` and `copiedLabel` to `CodeBlock.Copy`, which no longer
  takes `translations`.

specimen: pass palette to the catalogue's badges

- The audit finding and the props table set `palette` on `Badge`, which replaced `status`.

specimen: render the inverted ink on the inverted surface

- `Sample` takes `variant="inverted"`: a `bg.inverted` fill, the `fg.inverted` ink and 8px padding.
  The other looks still set no text colour.
- `grounded(tone, cell)` returns the cell in an inverted sample when `tone` is `inverted`, and the
  cell unchanged for any other tone. The inverted ink failed axe `color-contrast` on six typography
  pages, where it rendered on the page background.

specimen: add Contained and Focused

- `Contained` renders a box with `contain: layout`, the containing block of a `position: fixed`
  descendant. A skip link revealed by Tab inside it renders at the box's corner and not over the
  catalogue.
- `Focused` renders a `Contained` and sets `data-focus-visible` on its first focusable descendant,
  which every `_focusVisible` condition matches. A focus ring on a visible control renders in a
  still image without taking focus.
- The preset registers the `contained` recipe.
