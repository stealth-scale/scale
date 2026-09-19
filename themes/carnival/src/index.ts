/**
 * States Carnival: a red product with orange and yellow beside it, on navy after dark and on cream
 * by day. The four colors are stated outright and every other value is a tint or a mix of them, so
 * the theme adds no grey of its own. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a red product with orange and yellow beside it, on navy after dark and on cream by day.
 */
export const carnival: Theme = defineTheme({ name: "carnival", semanticTokens, tokens });
