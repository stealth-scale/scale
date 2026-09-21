# @stealthscale/theme-blush

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`52fcbed`](https://github.com/stealth-scale/scale/commit/52fcbed807badc5d9dc74c33c5ac1c2940c1695f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme-blush: add the theme
  
  - A pink product on navy and pearl, with round corners. The navy is the dark page and the light ink,
    the pink the primary and the keyword ink, the petal the dark ink and the tag ink, and the pearl
    the light page. The secondary is the ink of each mode.
  - The four colors are stated outright and `defineTheme` draws every other value from them at the
    ratios the gate measures. The pink stands from the pearl at 3:1 and carries its label at 4.5:1,
    which moves it darker by day while it keeps its hue. An error a shade off the pink is moved a step
    in lightness so a destructive action is told from the primary. The specification runs every check
    with nothing skipped.
  - Blush draws round on every axis it states. The page is read in a rounded system stack and the
    corners come from a rem and a quarter, with a recipe extension rounding every button to a pill. A
    medium control is padded by a rem and a quarter, drawn at 105% density. The surfaces after dark
    keep seven tenths of the navy's chroma and the shadows fall at four fifths of the default ink.
    Every pace is a tenth longer than the foundation's, every heading is set bold, and every label
    semibold.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
