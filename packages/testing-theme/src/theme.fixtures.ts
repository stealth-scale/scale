/**
 * Builds the two themes the specifications run through the gate: the foundation wrapped as a
 * theme, and a single-palette theme a case can override roles on.
 */

import { colorScale, drawn, FOUNDATION, type Theme } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

/**
 * Wraps the foundation preset as a theme, so the gate checks it like any other theme.
 *
 * @remarks
 *   The preset's `theme.extend` tokens are lifted onto the theme's `variant`, because that is
 *   where the gate reads a theme's values from. A preset that extends neither is still a theme.
 */
export function foundationTheme(): Theme {
  const stated = foundation.theme?.extend;

  return {
    axes: { colors: FOUNDATION },
    fonts: [],
    name: "foundation",
    preset: foundation,
    variant: {
      ...(stated?.semanticTokens === undefined ? {} : { semanticTokens: stated.semanticTokens }),
      ...(stated?.tokens === undefined ? {} : { tokens: stated.tokens }),
    },
  };
}

/**
 * Builds a theme carrying a single palette, drawn from the foundation's blue over the foundation's
 * pages.
 *
 * @remarks
 *   The theme also carries a ramp of the same blue, so a case can point a role at one of its steps
 *   rather than at a literal colour.
 * @param over - Roles to replace on the drawn palette.
 */
export function paletteTheme(over: Readonly<Record<string, unknown>> = {}): Theme {
  return {
    axes: {},
    fonts: [],
    name: "audited",
    preset: { name: "@stealthscale/theme-audited" },
    variant: {
      semanticTokens: {
        colors: { primary: { ...drawn(FOUNDATION.primary, FOUNDATION), ...over } },
      },
      tokens: { colors: { primary: colorScale(262, 0.14) } },
    },
  };
}
