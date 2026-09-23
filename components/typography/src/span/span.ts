/**
 * Renders a span through the span recipe.
 *
 * @remarks
 *   A `span` has no semantics, so a screen reader reads its text as part of the line. `Em` marks
 *   stress, `Strong` importance, `Mark` a highlight and `Quote` a quotation.
 */

import { type ComponentProps } from "react";

import { withContext } from "#span/context.ts";

/**
 * Renders a `span` element with the classes of the span recipe.
 */
export const Span = withContext("span");

/**
 * Describes the props of Span: the recipe's variants and the props of a `span` element.
 */
export type SpanProps = ComponentProps<typeof Span>;
