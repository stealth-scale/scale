/**
 * Renders a badge through the badge recipe.
 *
 * @remarks
 *   The element is a `span` with no role, so a screen reader announces only its text. A badge that
 *   conveys a status by color states the status in its text, because WCAG 1.4.1 rejects color
 *   alone. Pass `role="status"` to announce a count as it changes.
 */

import { type ComponentProps } from "react";

import { withContext } from "#badge/context.ts";

/**
 * Renders a `span` with the recipe's classes.
 */
export const Badge = withContext("span");

/**
 * Describes the props of Badge: the recipe's variants and the props of a span element.
 */
export type BadgeProps = ComponentProps<typeof Badge>;
