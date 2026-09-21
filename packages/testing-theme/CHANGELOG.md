# @stealthscale/testing-theme

## 0.3.0

### Minor Changes

- [#32](https://github.com/stealth-scale/scale/pull/32) [`5a940ac`](https://github.com/stealth-scale/scale/commit/5a940acc5de052023da9dc78bf4e61bb5d0ab183) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-theme: hold a theme to the ladders and the ratios it is drawn to
  
  - The thresholds gain `tertiary` at 4.5, `label` at 4.5, `hairline` at 1.45 and `identity` at 30
    degrees, and `distinct` rises from 0.01 to 0.02.
  - `contrast.text` measures `fg.subtle` on every surface at the tertiary ratio, each palette's
    `contrast` on its solid and its hover at the label ratio, and each palette's `fg` on the page, the
    raised surfaces and its fills. `contrast.boundary` measures `border.emphasized` on the page, the
    panel, the popover and the first well, `border` on the page and the panel at the hairline ratio,
    and each palette's solid and lines on the page and the panel.
  - `distinct.surfaces` pairs the page with the panel and with the first well, the raised surfaces
    with the first well, and each well with the next. `distinct.fills` drops the ink pair, whose role
    left the palette, and adds the resting fill against the page, the panel and the popover.
  - `status.distinct` holds each status apart from the primary and the neutral as well as from the
    other statuses. `status.identity` reports a status solid more than thirty degrees of hue from the
    canonical hue of its status, or a grey.
  - `recipe.subtle` is gone. `fg.subtle` is tertiary text at AA.
  - The palette fixture is drawn from the foundation's blue over the foundation's pages, and a case
    that follows a reference through a role states the reference itself.
  
  testing-theme: report a status the compiler emits no rule for
  
  - `recipe.emitted` reports a recipe that offers a `status` axis without listing it under
    `staticCss`. The compiler emits a rule for a value it reads from a literal in an application's
    source, and a status is the one axis an application usually does not write: it hands over what a
    record, a validator or a server said. The class is written on the element with no rule behind it,
    and a component reporting an error draws in its default palette.
  - Measured on the single-theme example, which writes three of the four statuses nowhere: the
    stylesheet emitted no rule for `success`, `warning` or `info` before, and all four after, at a
    cost of 0.19 kB over the wire.
  - The check accepts `*` for a whole recipe and a list of values for one axis. It refuses `true`,
    which the compiler's own types offer for an axis and its compiler ignores, because a recipe
    written that way type-checks, emits nothing, and reads as though it had been handled.
  
  testing-theme: add the distinctness, status and ramp checks and the report
  
  - `distinct.surfaces`, `distinct.inks`, `distinct.lines` and `distinct.fills` report two consecutive
    steps closer than 0.01 in OKLab lightness, in either mode. The pairs of a palette are a quiet fill
    and the next, the solid and its hover, the ink and the muted one, and the line and its hover.
  - `status.distinct` reports two status solids closer than 0.05 in OKLab.
  - `ramp.monotonic` reports a ramp under `tokens.colors` whose lightness turns back between two
    steps, and `ramp.hue` a step that drifts more than 45 degrees from the ramp's median hue.
  - `options.thresholds` takes `distinct`, `status` and `hue` beside the three ratios.
  - `report(theme, options)` measures the margins of each class of pair, the lightness between
    consecutive steps, the distance between the statuses for typical vision and under protanopia,
    deuteranopia and tritanopia, and the steps outside sRGB. `formatReport` writes it as Markdown.
  - `colorAt`, `rampsOf`, `outsideGamut`, `gamut`, `statusPairs`, `distance`, `distanceFor`,
    `simulated`, `written` and `DEFICIENCIES` are readers a theme specification can build its own
    cases on.
  
  testing-theme: check the code family
  
  - `contract.roles` reports a `code` family that leaves one of its ten kinds out, beside the three
    families it checked before.
  
  testing-theme: read a recipe's styles from the styles rather than from every key
  
  - The walker descends a variant's axis and value by name rather than as styles. A value is free to
    be called anything, and some of those names are also properties the compiler resolves. A highlight
    called `fill` read as the SVG property of that name, so `outlineStyle: "solid"` under it was
    reported as a color token no theme defines.
  - A recipe may name a CSS system color. A forced-color mode replaces every color an author writes,
    so a recipe naming one is the only way a marked row or a switch's thumb is still seen there.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0

## 0.2.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`f825fa3`](https://github.com/stealth-scale/config/commit/f825fa383b1886d3eaf52648621a0cc9fc60c810) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-theme: find a part by its slot class and a recipe file by its directory
  
  - `slotElement` and `slotClasses` take the recipe's name beside the slot's and find the part by its
    slot class, `card__header`, or by the part an anatomy stamps. The slot binding no longer writes
    `data-slot`, which the slot class already said.
  - `recipeFiles` lists a file named `recipe.ts` under its directory's name, so `button/recipe.ts`
    registers as `button` beside `button.recipe.ts`.
  - `recipeViolations` reports four more things the runtime writes a class for and no rule reaches: a
    value or a compound that states no styles, a default naming a value the axis does not offer, a
    compound matched on such a value, and, with `names`, a `jsx` pattern that misses a name a consumer
    writes the component under.
  - `violations` on a theme reports `contract.variants`: an extension styling an axis the recipe does
    not offer, a value the axis does not offer, or a part the recipe's value does not style.
    `contract.compounds` also reports a compound styling a part the recipe's compound does not.
  - `boundViolations` renders a bound component once with nothing picked and once per value of every
    axis, and reports each class the element lacks and each class it has that the recipe does not
    write. A part named by `slot` gets a value's class only where the value styles that slot, and
    `defaults` names the values a binding fixes through its default props, each of which the recipe
    lists under `staticCss` or the check reports.
  - `recipe.values` reads the part each value styles, so two axes of a slot recipe may offer one value
    where they style different parts. A grid offering three columns on its root and a span of three on
    its entry writes one class on the root and another on the entry. Two axes sharing a value on one
    part are still reported.
  - `boundMachineViolations` reports the same differences as `boundViolations` for a component whose
    state machine commits after it mounts. Such a component cannot be rendered synchronously without
    leaving an update outside the act scope React checks, so this awaits each render. The renders run
    one after another, because each mounts into the document and two act scopes open at once report
    the same thing. `boundViolations` is unchanged, which keeps the 55 synchronous call sites as they
    are.

### Patch Changes

- Updated dependencies [[`3d36966`](https://github.com/stealth-scale/config/commit/3d36966874f41fcd0c90cef2c4c7eae223b5edac)]:
  - @stealthscale/theme@0.3.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c), [`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c)]:
  - @stealthscale/pandacss-naming@0.2.0
  - @stealthscale/theme@0.2.0

## 0.1.0

### Minor Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`ce44d1e`](https://github.com/stealth-scale/config/commit/ce44d1e0c12bff1b597f0fd86e38fcf0abaeda0c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - testing-theme: add the theme testing kit
  
  - `violations(theme, options)` checks a theme against the contract and the contrast table: every
    role and every mode, every reference, every extension and its compounds, every text pair at 7:1
    and every line and ring at 3:1.
  - `recipeViolations(recipe, options)` reports a color a theme cannot move, a token or a condition
    the preset does not define, a length in px, rem or pt, a color mode, a slot the anatomy does not
    stamp, and `fg.subtle` as a text color.
  - `presetViolations(preset, options)` reports a recipe file the preset does not register, a key that
    is not the class name in camel case, and a slot recipe under the wrong section.
  - The readers list the classes a recipe emits, read what a recipe declares, read what a rendered
    component drew, and resolve a theme's colors through every reference.
  - `slotElement` and `slotClasses` find a part by the `data-slot` a slot binding stamps as well as by
    the `data-part` an anatomy stamps, so a compound component with no machine behind it is read the
    same way.
  - `recipe.tokens` reads a token named by one word, so `l9` and `stiky` are reported where the dotted
    form alone was. Nine of the categories a theme states are keyed by one word. A CSS-wide keyword
    and a size a box takes from its content are passed over.
  - `recipe.lengths` leaves out what the compiler resolves, so `token(spacing.4, 4px)` is no longer
    read as a hard-coded length.
  - The walk reads a key as a property where the compiler resolves one of that name, so a value under
    a range breakpoint such as `smDown` is checked against the property above it. A written list of
    six breakpoint names had left every derived form unchecked.
  - `recipeFiles` finds a recipe whose export carries a type, and one whose definition is written on
    the next line, and reads whether it is slotted from the call. One spelling was recognised, and a
    file written any other way was reported as backed by no file.
  - `contract.modes` reports a color whose value states no mode the kit knows, an empty object or a
    pair of keys misspelt, which every check passed over.
  - `contract.compounds` reports rather than throws where the component's own recipe carries a
    compound matched on a value a class name cannot carry.
  - `fonts.installed` resolves a font package from the directory the specification names and reports
    nothing without one, as the listing check does. It resolved from the working directory, so the
    answer depended on where the run was started.
  - `publishedRecipes(...presets)` maps every recipe the component packages register to its key, for
    `options.recipes`. A theme specification that passed a list of names left the compound check out,
    because the check needs the recipes themselves.
  - `variantClass`, `slotClass`, `slotVariantClass` and `compoundClass` write the naming scheme
    through `@stealthscale/pandacss-naming`, so `variantClass("button", "size", "lg")` returns
    `button--lg`, `variantClass("button", "loading", true)` returns `button--loading` and
    `compoundClass("button", "hero")` returns `button--hero`, and the kit holds the separator and the
    theme attribute equal between the design-system package and the build plugin.
  - `recipe.values` reports a value that writes the class another value writes across the recipe's
    axes, or that a boolean axis writes at `true`, since the scheme writes a variant's class from the
    value alone. `recipe.compounds` reports a compound without a name, two compounds under one name,
    and a name that writes the class of a variant.

### Patch Changes

- Updated dependencies [[`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16), [`459eb8c`](https://github.com/stealth-scale/config/commit/459eb8cdeb48bea844b906098740c941aec22278)]:
  - @stealthscale/pandacss-naming@0.1.0
  - @stealthscale/theme@0.1.1
