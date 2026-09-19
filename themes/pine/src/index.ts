/**
 * States Pine: a green product with teal and sage beside it, on the night after dark and on the
 * palest sage by day. The four colors are stated outright and every other value is a tint or a
 * mix of them, so the theme adds no grey of its own. Nothing here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a green product with teal and sage beside it, on the night after dark.
 */
export const pine: Theme = defineTheme({ name: "pine", semanticTokens, tokens });
