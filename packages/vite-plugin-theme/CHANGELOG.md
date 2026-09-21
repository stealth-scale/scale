# @stealthscale/vite-plugin-theme

## 0.2.0

### Minor Changes

- [#34](https://github.com/stealth-scale/scale/pull/34) [`35ed1e2`](https://github.com/stealth-scale/scale/commit/35ed1e20a3ba344ad15a13b716123b04f6db88d6) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-theme: watch the workspace packages and draw the foundation without a theme
  
  - `theme.stylesheet()` hands the source directory of every workspace package the compiler scans to
    the dev server's watcher, so a file added to a package beside the application reaches the compiler
    without a restart.
  - An application whose statement names no theme compiles the foundation and the published presets
    alone. `Application.themes` is optional.
  - The compiler's base preset is installed without its patterns in both rendered configurations, so
    the runtime carries no pattern module and the compiler reports no conflict between a recipe named
    `stack`, `grid`, `container`, `divider` or `spacer` and a pattern of the same name.
  
  vite-plugin-theme: require a contributor to name the system package
  
  - A package on the graph contributes a preset when it publishes `./theme` and is the system package
    or names it as a dependency or a peer. `@tanstack/highlight` publishes `./theme` of its own, and
    the dev server failed to start with it on the graph: the plugin imported it as a preset.
  
  vite-plugin-theme: render every moded color as light-dark()
  
  - A color stated in both modes, in the foundation, a preset or a theme, is written into the
    compiler's configuration as one `light-dark(light, dark)` value. The browser evaluates it where
    the color is used, against the element's `color-scheme`, so a subtree switched to light inside a
    dark page reads the light side, which the dark attribute blocks never gave it. An alias of such a
    color inherits the function unevaluated and evaluates at the use site too.
  - The dark attribute and dark preference blocks for colors are gone from the stylesheet. The
    multi-theme example's stylesheet falls from 654 to 487 kB, and from 80 to 45 kB gzipped. Its
    tokens layer falls from 70 to 35 kB gzipped.
  - A color stated once, one naming a condition beside the two modes, and every token outside the
    `colors` group are written as they are.
  
  vite-plugin-theme: scope a theme's rules to the nearest theme
  
  - A theme's rules are nested under `[data-theme=<name>] &:not([data-theme=<name>] [data-theme] *)`
    rather than under the attribute alone. The exclusion stops them at the boundary of a theme nested
    inside, which is what a reader means by the theme a thing is in. A theme's tokens already stopped
    there, because the inner element redeclares them, and its rules did not: a button inside Ink
    inside Regatta was drawn in Ink's colors and Regatta's capitals, weight and corners.
  - Measured in Chromium against the compiled stylesheet: that button now reads weight 500, no
    transform and a 7.5px corner, which is what Ink draws on its own.
  
  vite-plugin-theme: start the compiler without holding the dev server
  
  - A dev server starts the assembly at `buildStart` and answers its first request without waiting for
    it: the stylesheet waits when it is asked for, beside the modules the server transforms meanwhile.
    The catalogue's server answered its first request after 0.4 seconds rather than 3.3. A build still
    waits, because everything it bundles reads the compiled rules. An assembly that failed is tried
    again on the next request rather than reported for the life of the process.
  - A change the server reports is applied once, however many environments it is reported to and
    however many times an editor saves it, and the rules are compiled there rather than at the next
    request. A change that compiles to the rules the stylesheets already hold, which is most edits to
    a specimen or a page, invalidates nothing and sends nothing to the browser. The catalogue's server
    sent the stylesheet three times per save before.
  - The bundling server runs no hot update hook, so a change it reports is applied to the compiler
    from `watchChange`, where the environment says it bundles. The presets are imported through the
    server's `ssr` runner, whose graph the server invalidates only once every watch change has
    returned, so the changed file is invalidated first: the assembly imported the recipe the runner
    evaluated before the edit otherwise, and a recipe edit reached the browser only after a second
    save. The bundler regenerates the stylesheets itself, from the watch files the transform
    registered for every source behind them. A recipe edit reaches the page in 2.9 seconds, with the
    page's state kept.

### Patch Changes

- Updated dependencies [[`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5)]:
  - @stealthscale/vite-plugin-base@0.3.0

## 0.1.3

### Patch Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`d9273ab`](https://github.com/stealth-scale/config/commit/d9273ab627a7c7dfc0060956023ababe0d44a2b7) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-theme: generate a runtime that writes no slot attribute
  
  - The generated slot binding no longer writes `data-slot` on a part. A part's slot class,
    `card__header`, names the recipe and the slot, and the testing kit reads that class instead.
- Updated dependencies [[`d9273ab`](https://github.com/stealth-scale/config/commit/d9273ab627a7c7dfc0060956023ababe0d44a2b7)]:
  - @stealthscale/pandacss-compiler@0.2.0

## 0.1.2

### Patch Changes

- [#25](https://github.com/stealth-scale/config/pull/25) [`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-theme: complete a theme with the tokens the themes disagree on alone
  
  - A theme's variant is completed with the foundation's value for each token another theme states and
    it leaves unstated, and for no other. A token no theme states has the foundation's value
    everywhere already, so restating every token under every theme doubled the gzipped stylesheet for
    nothing. `stated(variants)` lists the tokens any theme states, and `completed` takes that shape.
- Updated dependencies []:
  - @stealthscale/pandacss-compiler@0.1.1

## 0.1.1

### Patch Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`ba436f5`](https://github.com/stealth-scale/config/commit/ba436f5c114bdf1287f81058c12b6c3aee1df8c5) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-theme: declare the class a compound's styles are emitted under
  
  - The generated `recipes/runtime.d.mts` types `className` on a recipe's compound and `classNames` on
    a slot recipe's, which the runtime reads and the recipe writes.
  - `LAYER_DECLARATION` publishes the at-rule an application's stylesheet opens with, under the layer
    names an application gets without stating any. Renaming a layer left every specification that
    wrote the line out asserting against the old names.
  - `theme.stylesheet()` installs the presets an application states under `presets` in
    `theme.config.ts`, after every package's preset and before the themes, so a theme extends a recipe
    written in the application as it extends one a package published.
  - Both rendered configurations set the compiler's `separator` to its default underscore, and the
    plugin rewrites what the compiler writes into the naming scheme of `@stealthscale/pandacss-naming`
    through `@stealthscale/pandacss-compiler`: `generateRuntime` rewrites the generated runtime before
    it syncs it, and the stylesheet plugin renames every class selector after it compiles. A variant
    reads `button--lg`, a boolean axis `card__content--bleed` and nothing at `false`, a slot
    `card__root`, and an atomic class `grid-ar-sizes-32` or `md:grid-tc-repeat-3-minmax-0-1fr`. What
    the rename found is reported as a third stage, `the class names`. `SEPARATOR` and
    `THEME_ATTRIBUTE` are exported, so a package that writes the same names can hold itself to them.
  - A theme's compound takes the class the published recipe emits its own compound for the same
    selection under, so a theme that extends the `hero` compound of a button draws under
    `[data-theme=forge] .button--hero`. A compound over a slot recipe is split per slot it styles, as
    the recipe's own was. `publishedCompounds(presets)` reads the classes, and `scopedPresets` takes
    them.
  - Every theme's variant is completed with the foundation's tokens and semantic tokens before it is
    installed, so a subtree switched to a theme is drawn from that theme and the foundation alone. A
    theme that stated no font took the font of the theme around it, because a custom property inherits
    and the compiler emits only what a variant states.
- Updated dependencies [[`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16)]:
  - @stealthscale/pandacss-compiler@0.1.0
  - @stealthscale/vite-plugin-base@0.2.0

## 0.1.0

### Minor Changes

- [#19](https://github.com/stealth-scale/config/pull/19) [`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - vite-plugin-theme: generate the styling runtime and compile the stylesheet
  
  - `theme.runtime()` generates the runtime a design-system package publishes, from the preset it
    publishes under `./theme`, into `generated/`, and regenerates it when a file behind the preset
    changes.
  - `theme.stylesheet()` loads an application's `theme.config.ts` and every contributor's preset
    through Vite, renders the compiler's configuration with every value inlined, compiles the
    stylesheet into whichever file declares the cascade order, and recompiles on a change.
  - Every theme is compiled under `data-theme`, the first theme unscoped as well, and the compiler's
    name appears nowhere in the output.

### Patch Changes

- Updated dependencies [[`8cc2075`](https://github.com/stealth-scale/config/commit/8cc20751fe95cc28db6f0e5df3d4ac7e5936f354)]:
  - @stealthscale/vite-plugin-base@0.2.0
