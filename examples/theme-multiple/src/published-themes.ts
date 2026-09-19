/**
 * Lists the ten published themes, in the order the page offers them after the four example themes.
 */

import { ink } from "@stealthscale/theme-ink";

import { paletteThemes } from "#palette-themes.ts";

/**
 * Lists the published themes: Ink, the look the components were drawn against, then nine each
 * drawn from four colors stated outright.
 */
export const publishedThemes = [ink, ...paletteThemes] as const;
