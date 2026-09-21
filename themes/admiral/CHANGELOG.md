# @stealthscale/theme-admiral

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`52fcbed`](https://github.com/stealth-scale/scale/commit/52fcbed807badc5d9dc74c33c5ac1c2940c1695f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme-admiral: add the theme
  
  - A teal blue product on navy and chalk. The navy is the dark page and the light ink, the blue the
    panel on the dark page, the secondary, the accent and the type ink, the teal blue the primary and
    the keyword ink, and the chalk the light page and the dark ink.
  - The four colors are stated outright and `defineTheme` draws every other value from them at the
    ratios the gate measures. Each status keeps its canonical hue at the chroma of the teal blue, so
    information is told from the primary and no status shouts over a quiet brand. The specification
    runs every check with nothing skipped.
  - Admiral draws formal. Every heading is set semibold and tracked tight in a transitional serif
    system stack, the corners come from a quarter rem, an indicator is three pixels wide, and the
    shadows fall a fifth harder than the default ink.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
