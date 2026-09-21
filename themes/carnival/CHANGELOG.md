# @stealthscale/theme-carnival

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`52fcbed`](https://github.com/stealth-scale/scale/commit/52fcbed807badc5d9dc74c33c5ac1c2940c1695f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme-carnival: add the theme
  
  - A red product with orange and yellow beside it, on navy after dark and on cream by day. The navy
    is the dark page and the light ink, the red the primary and the keyword ink, the orange the
    secondary and the string ink, and the yellow the accent and the number ink. The dark page is
    written in a pale yellow.
  - The four colors are stated outright and `defineTheme` draws every other value from them at the
    ratios the gate measures. Each status keeps its canonical hue at the chroma of the red, with an
    error a shade off the red moved in lightness so a destructive action is told from the primary. The
    specification runs every check with nothing skipped.
  - Carnival draws playful on every axis it states. The corners come from one rem with the inner
    corner at half a rem, and the shadows fall a quarter harder than the default ink. A medium control
    is two and three quarter rem tall, drawn at 105% density. Every pace is 15% shorter than the
    foundation's. The scale climbs by a minor third, every heading is set extrabold in a humanist
    system stack, and every label bold.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
