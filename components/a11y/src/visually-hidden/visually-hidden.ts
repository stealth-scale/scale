/**
 * Renders a visually hidden element through the visually-hidden recipe.
 *
 * @remarks
 *   The element is `span`, which has no semantics. `as` sets a heading or another element. The
 *   usual content is the accessible name of an icon-only control, a heading the document outline
 *   needs and the layout has no room for, and an instruction a screen reader reads before a
 *   control.
 */

import { type ComponentProps } from "react";

import { withContext } from "#visually-hidden/context.ts";

/**
 * Renders a `span` element with the classes of the visually-hidden recipe.
 */
export const VisuallyHidden = withContext("span");

/**
 * Describes the props of VisuallyHidden: the recipe's variants and the props of a `span` element.
 */
export type VisuallyHiddenProps = ComponentProps<typeof VisuallyHidden>;
