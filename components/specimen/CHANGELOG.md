# @stealthscale/specimen

## 0.2.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`32dbbac`](https://github.com/stealth-scale/scale/commit/32dbbac565565f55a04573e8260d06dc361de08f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specimen: draw every cell as a sample and lay them on equal columns
  
  - `Sample` is one captioned drawing of a component: the caption, the component, and a box whose look
    and placement are its axes. A matrix and a board both draw their cells as samples, so a page that
    crosses an axis and a page laid out by hand read alike.
  - `Board` arranges the samples a specimen writes itself, on the library's grid. It takes the grid's
    columns, gap, alignment and flow, and states the look of every sample on it once. Use it where the
    drawings are not one per value of an axis.
  - A matrix of one axis lays its cells on the same grid rather than in a wrapping stack. Cells took
    their own widths before, which put the captions at uneven intervals and left a ragged edge down
    the page. The columns default to as many of the smallest measure as the room holds, whether or not
    there are samples for all of them, so two scenes of one page line up with each other.
    `direction="column"` still draws one cell per row, and `columns` overrides both.
  - A sample's box fits what it holds until `place` asks for the cell. A box wider than the component
    frames the room beside it rather than the component.
  - `Scene` takes a `frame`: `inset` leaves the card's own room, `bleed` takes it back so a component
    that is already a panel meets the card's edges, and `bare` drops the card's surface.
  - The caption moved out of the matrix, because a sample captions itself and a matrix captions the
    edges of a crossed grid.
  - The catalogue's passages read `CodeBlock.Copy` rather than wiring the clipboard themselves.

- [#43](https://github.com/stealth-scale/scale/pull/43) [`fefde06`](https://github.com/stealth-scale/scale/commit/fefde0656383e78cf1c0341d16c5ce5267accd35) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Say why a page or its props could not be loaded, with a button that reloads the document, instead of
  drawing an empty page or an empty table for a chunk a deployment no longer serves. `useDeclared` and
  `useAnatomy` hand the failure back beside the page and the parts. Read a framed document's report
  only from a frame the page holds, at the page's own origin. Publish the `locales` directory, so an
  installed catalogue is discovered.

- [#34](https://github.com/stealth-scale/scale/pull/34) [`6990b94`](https://github.com/stealth-scale/scale/commit/6990b94cfcab5367951c5feb18e59104cfcd5051) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - publish the catalogue, not only what a specimen is written with
  
  - `Rail` and `Page` draw the pages a build indexed, and `grouped`, `declared` and `parted` are the
    shaping behind them.
  - The pages come in as a prop rather than through `virtual:specimen-index`, so the package draws a
    catalogue without the build plugin in its own graph and a specification renders one without a
    build.
  - `parted` splits what a part accepts into the variants a theme moves and the options a caller sets,
    each row carrying the members of every named type it refers to, with the dropped counts beside
    them.
  - The catalogue's own words are keys under the `specimen` namespace in `locales/en/specimen.json`.
    An application renames one by declaring the same key, because the plugin reads packages deepest
    first and the application last.
  - The package peers on `@stealthscale/provider-i18n` and `@stealthscale/vite-plugin-specimen` beside
    what it already peered on.
  
  86 tests, 100% on all four metrics.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`1176fe2`](https://github.com/stealth-scale/scale/commit/1176fe27be6ce534199ff09ae00da44157f22524) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specimen: show a scene in a device of the size the viewport states
  
  - Each scene is drawn in its card until the viewport states a width, and in a `Device` from then on:
    a window of that size, which is a frame loading the application at its framed page with the
    scene's address in the fragment. Everything the scene draws sees a window of the device's size,
    the styling engine's media queries and the parts that portal to the body included, which a box
    held to a width on the page could not give it. The devices are a phone at the smallest measure and
    the theme's breakpoints, each with a height: 320 × 568, 640 × 960, 768 × 1024, 1024 × 768, 1280 ×
    800 and 1536 × 864. The frame is the device's size and nothing else, the way a phone is, so a
    sample shorter than the window is drawn at its top and one taller scrolls inside it. It is
    see-through and edged with a dashed hairline, loads again when the page changes its theme, its
    mode or its language, and loads when it comes into view.
  - Inside the window the scene is drawn in a `Pane` that meets the window the way the scene meets its
    card: an inset scene keeps the card's room from the edges and a bled or bared one fills the
    window. A scene declares `viewport: true` to fill the window whatever its frame, which is what a
    shell the height of its window needs.
  - A device shows one sample at a time. Over a matrix it draws a picker per axis and over a board one
    picker over the samples, each starting at the first value and forgotten with the page. A scene of
    one sample gets no picker. The framed document reports the axes its scene offers to the page
    holding it, so the page draws the pickers, and a pick moves the frame's fragment, which the
    document follows without loading again.
  - An application serves the framed page by naming it in `Placing.framed`, and `framedDeclaration` is
    the route `declarations` adds for it: at the root, in no layout, holding the sample and nothing
    else. Without it no scene is shown in a device. The kit's preset makes the root of a framed
    document see-through, so the sample is drawn on the card that holds the frame.
  - `PHONE`, `widthsOf` and `deviceOf` are published, so a switcher in an application's bar offers the
    same widths the page knows and agrees with it on the pixels. `Stage` and `stageWidthOf` are gone.
  - The package peers on `@stealthscale/component-disclosure` and `@stealthscale/provider-viewport`,
    and depends on `lucide-react` for the marks its own controls carry.
  
  specimen: redraw a page in place when its specimen is saved
  
  - `Page` and the framed page listen for the hot update the specimen plugin's boundary dispatches on
    the window, `specimen:updated`, and replace the page's scenes or its sources with what the new
    module declares. An edit to a specimen therefore redraws that page and nothing else, where it ran
    the application's own modules again before. `useLoadedPage` holds the loading and the listening.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`3385a3c`](https://github.com/stealth-scale/scale/commit/3385a3c8d3d1f1c19affe900b6e046ca22c1619f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - draw the catalogue on the screen components, and place it under one route
  
  - `declarations` takes a `Placing` and returns the route the catalogue hangs under, its index, and
    one page per entry nested under that route. The route draws the router's outlet, so an application
    names the layout once and every page is drawn inside it. `indexId` names the index.
  - `Index` draws the index as one section per group with a card per page. The card's title is the
    link. `Placing.beside` lists pages the application wrote with the rest, nested under the
    catalogue's route unless they name a parent of their own.
  - `Rail` is one `Sidebar.Nav` block holding a `NavList` branch per group. The branch holding the
    page being read opens, and a navigation into another group opens that one. Draw it inside
    `Sidebar.Root`.
  - `Page` draws the page's title and opening in a `Page.Header`, with the way back to the index in
    the row above the title, and each scene as a `Section` under its own heading.
  - An entry states `about`, the sentence the index opens a page's card with.
  - The package peers on `@stealthscale/component-navigation`, `@stealthscale/component-screen` and
    `@stealthscale/component-surfaces`, and no longer on `@stealthscale/component-actions`.
  
  149 tests, 100% on all four metrics.

- [#40](https://github.com/stealth-scale/scale/pull/40) [`14fe3ba`](https://github.com/stealth-scale/scale/commit/14fe3ba9bd2d3975bd0095dcecdd6040669d2bdf) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specimen: load axe on the first audit only
  
  - `audited.ts` imported the engine's types inline, which `verbatimModuleSyntax` keeps as a
    side-effect import, so axe-core (587 kB, 160 kB gzipped) was bundled into the chunk every reader
    loads first. The types come from `catalogue/types.ts` now, and the engine loads on the first
    audit. Measured on the docs build: the entry's static imports no longer reach axe.
  
  specimen: add audit rules and device heights to Placing, and a panel and a shortcut to RailSearch
  
  - `Placing.audit` takes axe's run options and `Placing.heights` the height per width name. Both
    reach every page through a context `declarations` provides, each merged over the catalogue's own,
    so a rule or a height the application does not name keeps the catalogue's value.
  - `RailSearch` takes `panel`, the name of the shell panel the rail is drawn in (`navbar` by
    default), and `shortcut`, the hotkey that focuses the field (`Mod+K` by default). The field's
    `aria-keyshortcuts` follows the shortcut.
  - `useWords()` with no prefix reads the catalogue's own words, so the namespace is named once.
  
  specimen: fix the props type, the audit control and the frame's location
  
  - `PropsType` matched a named type inside a longer identifier, so `Scaled` opened a control for
    `Scale`. A name matches a whole identifier now, and the longest name is tried first.
  - After a clean audit the next press did nothing and the press after it ran the audit. A press runs
    the audit whenever its panel is closed.
  - The device's frame loaded `/<path>` and ignored the router's base. It builds the location through
    the router where one is above it.
  - `useReportedChoices` posted on every render and `useUpdated` re-subscribed on every render. Both
    act once per change now.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`7f1cd6f`](https://github.com/stealth-scale/scale/commit/7f1cd6fca257450e70aeacfeed0e4b817a748940) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specimen: add a room, and order the size axis by the scale
  
  - `Room` is a box held to one of the page's measures, `sm` by default, for a scene that reads only
    once the width runs out, such as a row that wraps or a heading cut to one line. Its recipe is
    published with the kit's preset.
  - `valuesOf` returns the steps of the size axis in the scale's order, and a value the scale does not
    name after them in the recipe's order. The lint sorts the keys of an axis written by hand, so a
    recipe writing its own steps offered `lg, md, sm, xl, xs` and a page drew the scale out of order.

- [#34](https://github.com/stealth-scale/scale/pull/34) [`447426a`](https://github.com/stealth-scale/scale/commit/447426a6f4806535a258a70d608c5bc12c7ac441) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - publish the routes a catalogue is built from, and list the rail from them
  
  - `declarations` gives one route per indexed page, carrying no leading slash, so every page hangs
    beneath whatever parent an application compiles them under. A parent at `/docs` serves the button
    at `/docs/actions/button` and the package never states the prefix.
  - `Rail` reads declarations rather than the index, so a page an application wrote is listed beside a
    page the plugin found. `Entry` is the shape a declaration carries for it and `entryOf` reads it,
    because the router types `navigation` as `unknown` and a declaration the catalogue did not write
    could hold anything under that name.
  - `grouped` takes declarations and returns the tree the rail draws: groups sorted by name, pages
    sorted by the words their entry carries, and pages naming no group under a heading of their own,
    last.
  - `routeId` names a page's route. The package builds no router and states no address of its own.
  
  111 tests, 100% on all four metrics.

- [#38](https://github.com/stealth-scale/scale/pull/38) [`602e961`](https://github.com/stealth-scale/scale/commit/602e96102361e56695ecdb16f4880feaa2d289e5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specimen: spread a matrix and a board across the card they are drawn on
  
  - A matrix draws its columns as `minmax(min-content, 1fr)` rather than `max-content`, so the columns
    share whatever the card has left instead of packing against its start. A page of scenes read as a
    column of drawings down the left edge with the rest of the card empty.
  - The floor is each column's min-content rather than its max-content. A control that sets no width
    of its own reports the two alike and keeps the width it had. A control that fills whatever it is
    given reports a much smaller floor, so a row of them shares the card instead of overflowing it.
  - The cells stretch to their columns. `justify-content: start` packed the tracks themselves, which
    is what left the card half empty.
  - A matrix holds two rows one step further apart than two cells of one row. A row carries a caption
    of its own at the start of it, and the row gap is what holds that pair together against the pair
    above.
  - A board fits its columns rather than filling them. A filled row keeps the columns nobody wrote a
    sample for, so two samples on a wide card each took a quarter of it and anything wider than a
    quarter was cut off. Fitting drops the empty columns, so two samples take half the card each and
    one takes all of it.
  - `Sample` still fits its drawing by default. A scene whose component should reach the far side of
    its column states `place="start"`, which is now recorded on the axis: eight fields drawn at
    `start` ask for more than a card holds and the last three fall off the edge.

- [#41](https://github.com/stealth-scale/scale/pull/41) [`83359f1`](https://github.com/stealth-scale/scale/commit/83359f1b2738a6872e410040c0e98ba03b4763e3) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - specimen: list a sample's looks in the order the library reads them
  
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

### Patch Changes

- Updated dependencies [[`b271aae`](https://github.com/stealth-scale/scale/commit/b271aaec473fab167732606b8ffa52672259fcbf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`c8b2f1e`](https://github.com/stealth-scale/scale/commit/c8b2f1ea3cd9f92a5e80a0c275c69d5f4d5da8fd), [`e4af4b0`](https://github.com/stealth-scale/scale/commit/e4af4b04bef831df838cd56ee3401ce8a7222204), [`2e97f7e`](https://github.com/stealth-scale/scale/commit/2e97f7e8fd2064f07370a9dd06fe86d8e80ad7e8), [`8a79e78`](https://github.com/stealth-scale/scale/commit/8a79e7859434eddb7b0f9db73af2a0611c3aa716), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`b4823f8`](https://github.com/stealth-scale/scale/commit/b4823f832c93d3a70fe2935c9026cea7c36746bc), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`18e2d59`](https://github.com/stealth-scale/scale/commit/18e2d59bc110b9ab7f8f945e9ecc2a0bb1b48531), [`d577ce3`](https://github.com/stealth-scale/scale/commit/d577ce3a013b0af1f6cd2dce358f496382a58616), [`9c2af0c`](https://github.com/stealth-scale/scale/commit/9c2af0cbd07058744c266740ee1188f46eaa6a3f), [`345722c`](https://github.com/stealth-scale/scale/commit/345722c508064b16202cb9363668b44352f7a706), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`a4b1d24`](https://github.com/stealth-scale/scale/commit/a4b1d2460ded2afebd340ccdce38a79b1d880fdf), [`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34), [`ee9bec3`](https://github.com/stealth-scale/scale/commit/ee9bec31de357f6b26e79e755b6c2ee86159102e), [`c578d12`](https://github.com/stealth-scale/scale/commit/c578d12f4f26dbedd2b60f4bada00f4f4458ebf1), [`e94c22a`](https://github.com/stealth-scale/scale/commit/e94c22a6c39e1c13d8f99b46334ae8ecc7b65192)]:
  - @stealthscale/component-collections@0.1.0
  - @stealthscale/component-content@0.1.0
  - @stealthscale/component-data@0.2.0
  - @stealthscale/component-disclosure@0.1.1
  - @stealthscale/component-forms@0.2.0
  - @stealthscale/component-navigation@0.2.0
  - @stealthscale/component-screen@0.1.0
  - @stealthscale/component-surfaces@0.1.0
  - @stealthscale/component-a11y@0.1.1
  - @stealthscale/component-actions@0.2.0
  - @stealthscale/component-layout@0.2.0
  - @stealthscale/component-typography@0.2.0
  - @stealthscale/provider-router@0.2.0
  - @stealthscale/provider-viewport@0.2.0
  - @stealthscale/theme@0.4.0
  - @stealthscale/vite-plugin-specimen@0.2.0
  - @stealthscale/provider-hotkeys@0.1.0
  - @stealthscale/provider-i18n@0.1.0

## 0.1.0

### Minor Changes

- [#29](https://github.com/stealth-scale/config/pull/29) [`dd8f5e8`](https://github.com/stealth-scale/config/commit/dd8f5e823522d0becdd3218f1a2076fa6ad696d4) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - add what a specimen is written with
  
  - `specimen()` and `scene()` declare a page and the things drawn on it. The index plugin parses the
    call out of the source and never evaluates it.
  - `Matrix` draws one captioned cell per value of an axis, with `of`, `knob` and `label` describing
    the axis and `direction` the arrangement.
  - Draw the arrangement as `Stack` and the caption as `Text`, so the package states no recipe and
    registers no preset.
  - Write both arrangements out rather than forwarding `direction` to one stack, because the compiler
    extracts a JSX literal and not a value read from a prop.
  
  27 tests, 100% on all four metrics.
