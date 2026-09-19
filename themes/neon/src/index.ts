/**
 * States Neon: a violet product with hot pink and yellow beside it, on grape after dark and on the
 * palest violet by day. The four colors are stated outright and every other value is a tint or a
 * mix of them, so the theme adds no grey of its own. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a violet product with hot pink and yellow beside it, on grape after dark, with soft
 * corners.
 */
export const neon: Theme = defineTheme({ name: "neon", semanticTokens, tokens });
