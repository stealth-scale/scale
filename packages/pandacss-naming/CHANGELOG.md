# @stealthscale/pandacss-naming

## 0.2.1

### Patch Changes

- [#43](https://github.com/stealth-scale/scale/pull/43) [`66681c2`](https://github.com/stealth-scale/scale/commit/66681c2fa7e2c8a98a41090d225423ee0c8b04cb) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - Rename only the classes the compiler owns: a recipe-claimed class, and an atomic class whose utility
  carries the separator. Leave an author's own class as written.

## 0.2.0

### Minor Changes

- [#25](https://github.com/stealth-scale/config/pull/25) [`4d6bed5`](https://github.com/stealth-scale/config/commit/4d6bed5a3c60bb5518b7defac65cd812911e9f8c) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - pandacss-naming: write a value in lower kebab-case and drop a custom property's hyphens
  
  - `atomicClass` writes the value of an atomic class in lower kebab-case, so `bg_colorPalette.solid`
    becomes `bg-color-palette-solid` and `ff_Segoe_UI` becomes `ff-segoe-ui`. A class name resolves no
    token, so its case is free, and one case reads as one scheme.
  - The class of a custom property drops the hyphens the property opens with, so `--stagger_0` becomes
    `stagger-0`.

## 0.1.0

### Minor Changes

- [#21](https://github.com/stealth-scale/config/pull/21) [`ef9c601`](https://github.com/stealth-scale/config/commit/ef9c601e8224b34d545be51eced2a47354fc2e16) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - pandacss-naming: write every class name in one readable scheme
  
  - `variantClass("button", "size", "lg")` returns `button--lg`,
    `variantClass("button", "loading", true)` returns `button--loading`, and `false` returns an empty
    string, so an element carries no class for the absence of a state.
  - `slotClass("card", "content")` returns `card__content`, and `compoundClass("button", "expose")`
    returns `button--expose`, the name the author gave the compound.
  - `atomicClass(pandaClass, separator)` writes a named condition and the property's class in
    kebab-case, the separator as a hyphen, and the value sanitised: `grid-ar_{sizes.32}` becomes
    `grid-ar-sizes-32`, `md:grid-tc_repeat(3,_minmax(0,_1fr))` becomes
    `md:grid-tc-repeat-3-minmax-0-1fr`, `layerStyle_dim.others` becomes `layer-style-dim-others`, and
    `m_-4` keeps its sign as `m--4`. A raw selector or at-rule condition is kept as written.
  - `rename(pandaClass, config)` reads a class the compiler wrote as a variant where one of
    `config.recipes` claims it, reading the longest axis that fits, and as an atomic class otherwise.
  - `conditionsOf(pandaClass)` lists the conditions of a class, outer to inner, with a raw one in its
    brackets.
