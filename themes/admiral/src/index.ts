/**
 * States Admiral: a teal blue product on navy and chalk. The four colors are stated outright and
 * every other value is a tint or a mix of them, so the theme adds no grey of its own. Nothing here
 * names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a teal blue product on navy and chalk.
 */
export const admiral: Theme = defineTheme({ name: "admiral", semanticTokens, tokens });
