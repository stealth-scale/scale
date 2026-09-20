---
"@stealthscale/specimen": minor
---

publish the catalogue, not only what a specimen is written with

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
