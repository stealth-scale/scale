# @stealthscale/theme-dusk

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`52fcbed`](https://github.com/stealth-scale/scale/commit/52fcbed807badc5d9dc74c33c5ac1c2940c1695f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme-dusk: add the theme
  
  - A coral product with mauve and plum beside it, on navy after dark and on the palest coral by day,
    with soft corners. The navy is the dark page and the light ink, the coral the primary and the
    keyword ink, the mauve the secondary and the type ink, and the plum the accent and the tag ink.
    The dark page is written in a pale coral.
  - The four colors are stated outright and `defineTheme` draws every other value from them. The pale
    coral reads at 6.3:1 on the navy, so the theme states the ratios it draws to: text at 4.5:1, the
    tertiary ink at 3:1, and a label at 3:1, because a navy of middle lightness leaves a solid that
    carried its label at 4.5:1 nowhere to stand but the ink. The panel on the dark page is drawn from
    the navy rather than stated as the plum, because a secondary ink at that ratio has no room on the
    plum. The specification holds the theme to the same ratios with nothing skipped.
  - The warning, the success and the information are stated rather than left to their canonical
    colors: an ochre, a sage and a slate blue, each dusted to the theme's register and inside the
    thirty degrees of its canonical hue that the gate allows. The error is left to the engine, because
    the navy page of middle lightness leaves one band where a solid stands and carries a label, and
    every red settles into it beside the coral primary.
  - Dusk draws soft on every axis it states. Body text is set a sixteenth larger with relaxed leading,
    and every heading at the normal weight with snug leading in an old-style serif system stack. The
    corners come from one rem, and the focus ring is two pixels wide three pixels off the control. The
    shadows fall at half the default ink and the surfaces keep four fifths of the page's chroma. Every
    pace is half again the foundation's, and a thing that arrives or moves eases in and out.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
