/**
 * States Regatta: a crimson product with deep blue and teal beside it, on navy after dark and on
 * the palest navy by day. The four colors are stated outright and every other value is a tint or a
 * mix of them, so the theme adds no grey of its own. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a crimson product with deep blue and teal beside it, on navy after dark, with sharp
 * corners.
 */
export const regatta: Theme = defineTheme({ name: "regatta", semanticTokens, tokens });
