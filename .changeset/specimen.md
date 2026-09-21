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
  shows. A stated source is read before the one the index cuts out of the file.
- `written(snippet, props)` writes the component as a consumer writes it: the import above, every
  prop the cell is drawn with, and the children indented. A scene the generator did not build writes
  its source the same way.
- `uncovered(recipe, scenes, { skip })` reports an axis no scene draws and a skip naming an axis the
  recipe no longer offers.
- `stale(recipe, scenes)` reports a stated source naming a value its axis no longer offers, which is
  the one way a hand-written snippet drifts from the recipe.
