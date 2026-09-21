# @stealthscale/pandacss-compiler

## 0.2.1

### Patch Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`66681c2`](https://github.com/stealth-scale/scale/commit/66681c2fa7e2c8a98a41090d225423ee0c8b04cb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Leave a class an author wrote inside a raw condition alone when selectors are rewritten, so a
  literal descendant selector still matches the markup it was written for.
- Updated dependencies [[`66681c2`](https://github.com/stealth-scale/scale/commit/66681c2fa7e2c8a98a41090d225423ee0c8b04cb)]:
  - @stealthscale/pandacss-naming@0.2.1

## 0.2.0

### Minor Changes

- [#27](https://github.com/stealth-scale/config/pull/27) [`d9273ab`](https://github.com/stealth-scale/config/commit/d9273ab627a7c7dfc0060956023ababe0d44a2b7) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - pandacss-compiler: drop the slot attribute from the generated slot binding
  
  - `rewriteRuntime` rewrites a third file, `jsx/create-slot-recipe-context`, and drops the line that
    writes `data-slot` on a part, once in the provider and once in the part. Every part carries its
    slot class, `card__header`, which names the recipe and the slot, so the attribute repeated it. A
    rewrite that imports nothing marks its file with a comment on its first line.

## 0.1.1

### Patch Changes

- Updated dependencies [[`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c)]:
  - @stealthscale/pandacss-naming@0.2.0

## 0.1.0

### Minor Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - pandacss-compiler: rename a compiled stylesheet and its runtime into the scheme
  
  - `rewriteRuntime(dir, separator)` rewrites the lines of the generated runtime that write a class,
    in `helpers` and in `recipes/runtime`, so an atomic, a variant and a compound class pass the
    scheme under the separator the compiler was configured with, and prepends an import of
    `@stealthscale/pandacss-naming` to each file. Each line is matched once, as `@pandacss/compiler`
    2.0.0-beta.17 writes it, and a release that moves a line throws.
  - `renameSelectors(css, config)` renames each class in each selector through one parse, removes
    every selector that needs the class of a boolean axis at `false`, keeps `:not()` of it as written,
    prunes every block that leaves empty, and returns the stylesheet with a diagnostic for each
    collision, one for the classes whose rules were removed, and one for the classes kept under a raw
    condition at any depth.
  - `compilerConfig(config)` reads every recipe with its class, axes and slots, and the separator, out
    of the driver's resolved configuration.

### Patch Changes

- Updated dependencies [[`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16)]:
  - @stealthscale/pandacss-naming@0.1.0
