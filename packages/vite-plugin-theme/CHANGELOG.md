# @stealthscale/vite-plugin-theme

## 0.2.0

### Minor Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`66681c2`](https://github.com/stealth-scale/scale/commit/66681c2fa7e2c8a98a41090d225423ee0c8b04cb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Keep rendered configurations, codegen staging and the lock in the system temp directory.
  - Generate under one lock shared by the Vite plugin and the packer plugin.
  - Generate from the packer plugin on its first build when nothing is generated yet.
  - Replay pending stylesheet updates in order, and keep one sheet per environment.
  - Fail a build on an error, and keep the last good sheet in dev.
  - Leave an author's class inside a raw condition unchanged.
  - Match compound extensions against the inherited preset graph.
  - Watch every manifest that discovery reads.

- [#34](https://github.com/stealth-scale/scale/pull/34) [`35ed1e2`](https://github.com/stealth-scale/scale/commit/35ed1e20a3ba344ad15a13b716123b04f6db88d6) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - - Watch every workspace package's source directory from `theme.stylesheet()`.
  - Make `Application.themes` optional, and compile the foundation without a theme.
  - Install the base preset without its patterns.
  - Take a preset only from a package that is or depends on the system package.
  - Write every moded color as one `light-dark()` value.
  - Scope a theme's rules to the nearest `[data-theme]`.
  - Start the compiler at `buildStart` without blocking the dev server's first request.
  - Apply a change once, and send nothing when the compiled rules are unchanged.
  - Apply changes under a bundling dev server from `watchChange`.
  - Peer on `vite` 8.3 and `vitest` 5.0.
  - Depend on `@pandacss/compiler`, `@pandacss/preset-base` and `@pandacss/types` 2.0.

### Patch Changes

- Updated dependencies [[`66681c2`](https://github.com/stealth-scale/scale/commit/66681c2fa7e2c8a98a41090d225423ee0c8b04cb), [`ea7263b`](https://github.com/stealth-scale/scale/commit/ea7263ba8a41ef6bca751d5982194c6cec0824a7), [`725cf7e`](https://github.com/stealth-scale/scale/commit/725cf7eb750c998e795e546db2809009e6c3c2b5)]:
  - @stealthscale/pandacss-compiler@0.2.1
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
