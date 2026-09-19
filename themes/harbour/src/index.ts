/**
 * States Harbour: a steel blue product on navy and mist. The four colors are stated outright and
 * every other value is a tint or a mix of them, so the theme adds no grey of its own. Nothing here
 * names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a steel blue product on navy and mist.
 */
export const harbour: Theme = defineTheme({ name: "harbour", semanticTokens, tokens });
