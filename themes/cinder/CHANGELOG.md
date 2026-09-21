# @stealthscale/theme-cinder

## 0.1.0

### Minor Changes

- [#38](https://github.com/stealth-scale/scale/pull/38) [`52fcbed`](https://github.com/stealth-scale/scale/commit/52fcbed807badc5d9dc74c33c5ac1c2940c1695f) Thanks [@stealth-rklopper](https://github.com/stealth-rklopper)! - theme-cinder: add the theme
  
  - A red product on slate and ash, with sharp corners, a heavy control edge and hard shadows. The
    slate is the dark page and the light ink, the steel the panel on the dark page and the secondary,
    the red the primary and the keyword ink, and the ash the light page and the dark ink.
  - The four colors are stated outright and `defineTheme` draws every other value from them at the
    ratios the gate measures. The specification runs every check with nothing skipped.
  - Cinder draws hard on every axis it states. The corners come from an eighth of a rem, a control's
    edge is two pixels and an indicator three, and the focus ring is two pixels one pixel off the
    control. Every control, icon, tag, inset and gap is drawn at 95% density. A press is answered in
    three quarters of the foundation's time on a straight curve. Every heading is set bold and tracked
    tight in a grotesque system stack, every label semibold, and a recipe extension sets every badge
    in capitals.

### Patch Changes

- Updated dependencies [[`8d6817e`](https://github.com/stealth-scale/scale/commit/8d6817e34dc94a02b98933c39e2cd6f94cca5c34)]:
  - @stealthscale/theme@0.4.0
