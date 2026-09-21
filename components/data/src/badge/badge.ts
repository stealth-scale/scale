/**
 * Renders a badge through the badge recipe.
 *
 * @remarks
 *   The element is a `span` carrying no role, so assistive technology gets nothing but the text
 *   inside it. A badge whose meaning sits in its colour has to repeat that meaning in words: a red
 *   badge reading `3` tells a sighted reader that three things failed and tells a screen reader
 *   `3`. A caller who needs the count announced as it changes puts `role="status"` on it. The
 *   component contributes no colour, size or corner of its own; the recipe owns all of it, so
 *   extending the recipe restyles every badge.
 */

import { type ComponentProps } from "react";

import { withContext } from "#badge/context.ts";

/**
 * Renders a `span` carrying the look, size, corner and status its variants select.
 */
export const Badge = withContext("span");

/**
 * Combines the recipe's variants with every prop a `span` element accepts.
 */
export type BadgeProps = ComponentProps<typeof Badge>;
