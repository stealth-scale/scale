/**
 * States Dusk: a coral product with mauve and plum beside it, on navy after dark and on the palest
 * coral by day. The four colors are stated outright and every other value is a tint or a mix of
 * them, so the theme adds no grey of its own. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a coral product with mauve and plum beside it, on navy after dark, with soft corners.
 */
export const dusk: Theme = defineTheme({ name: "dusk", semanticTokens, tokens });
