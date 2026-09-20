/**
 * Builds the themes the specifications hold to the gate: the foundation wrapped as a theme, and a
 * theme of one palette whose colors a case can bend.
 */

import { colorScale, drawn, FOUNDATION, type Theme } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

/**
 * Wraps the foundation as a theme, so it is held to the same gate as every theme.
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
 * Builds a theme of one palette drawn from the foundation's blue over the foundation's pages,
 * with a ramp of the same blue a case may reference a step of, and whatever is handed in put over
 * the palette's roles.
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
