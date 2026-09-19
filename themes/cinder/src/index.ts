/**
 * States Cinder: a red product on slate and ash. The four colors are stated outright and every
 * other value is a tint or a mix of them, so the theme adds no grey of its own. Nothing here names
 * a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a red product on slate and ash, with sharp corners and hard shadows.
 */
export const cinder: Theme = defineTheme({ name: "cinder", semanticTokens, tokens });
