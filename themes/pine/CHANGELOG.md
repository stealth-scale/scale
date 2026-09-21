# @stealthscale/theme-pine

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`52fcbed`](https://github.com/stealth-scale/scale/commit/52fcbed807badc5d9dc74c33c5ac1c2940c1695f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme-pine: add the theme
  
  - A green product with teal and sage beside it, on the night after dark and on the palest sage by
    day. The night is the dark page and the light ink, the teal the secondary and the type ink, the
    green the primary and the keyword ink, and the sage the dark ink, the accent and the string ink.
  - The four colors are stated outright and `defineTheme` draws every other value from them. The sage
    reads at 6.7:1 on the night, so the theme states the ratios it draws to: text at 4.5:1 and the
    tertiary ink at 3:1. Each status keeps its canonical hue at the chroma of the green, so a success
    is told from the primary and no status shouts over a quiet brand. The specification holds the
    theme to the same ratios with nothing skipped.
  - Pine draws quiet on every axis it states. The surfaces keep seven tenths of the page's chroma and
    the shadows fall at three quarters of the default ink. Every control, icon, tag, inset and gap is
    drawn at 105% density, and a column of text is read at 68 characters. Every pace is three tenths
    longer than the foundation's, and every curve eases in and out. The scale climbs by a minor third,
    body text is set with relaxed leading, and every heading at a medium weight in a humanist system
    stack.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
