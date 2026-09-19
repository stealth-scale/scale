/**
 * States Blush: a pink product on navy and pearl, with round corners. The four colors are stated
 * outright and every other value is a tint or a mix of them, so the theme adds no grey of its own.
 * Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a pink product on navy and pearl, with round corners.
 */
export const blush: Theme = defineTheme({ name: "blush", semanticTokens, tokens });
