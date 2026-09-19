/**
 * States every theme the catalogue can wear.
 *
 * @remarks
 *   Two of the published set: the rest draw the components the same, so they show nothing a reader
 *   can compare, and a stylesheet carrying them is weight the browser parses for no picture. They
 *   return when the recipes pull them apart. Asphalt is first, which makes it the theme a page
 *   wears until somebody switches.
 *   `static` is `*` because a scene picks its variants while it runs. The compiler extracts a value
 *   written as a JSX literal and nothing it reads from a prop, so a matrix drawing `variant={one}`
 *   emits no rule for any value it draws. A product application states nothing here and ships only
 *   the rules its own source asks for.
 */

import { asphalt } from "@stealthscale/theme-asphalt";
import { prism } from "@stealthscale/theme-prism";
import { type Application } from "@stealthscale/theme/authoring";

export default {
  static: "*",
  themes: [asphalt, prism],
} satisfies Application;
