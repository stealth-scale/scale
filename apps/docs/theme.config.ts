/**
 * States every theme the catalogue can wear.
 *
 * @remarks
 *   The ten published themes: Ink, the look the components were drawn against, and nine each drawn
 *   from four colors stated outright, so the switcher shows the components in ten pictures a
 *   reader can compare. Ink is first, which makes it the theme a page wears until somebody
 *   switches.
 *   `static` is `*` because a scene picks its variants while it runs. The compiler extracts a value
 *   written as a JSX literal and nothing it reads from a prop, so a matrix drawing `variant={one}`
 *   emits no rule for any value it draws. A product application states nothing here and ships only
 *   the rules its own source asks for.
 */

import { ink } from "@stealthscale/theme-ink";
import { type Application } from "@stealthscale/theme/authoring";

import { paletteThemes } from "#palette-themes.ts";

export default {
  static: "*",
  themes: [ink, ...paletteThemes],
} satisfies Application;
