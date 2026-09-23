/**
 * Renders a spacer through the spacer recipe.
 *
 * @remarks
 *   The element is an empty `div` with `aria-hidden`, so a screen reader skips it and meets no
 *   unnamed element between two controls.
 */

import { type ComponentProps } from "react";

import { withContext } from "#spacer/context.ts";

/**
 * Renders an empty `div` element with the classes of the spacer recipe and `aria-hidden`.
 */
export const Spacer = withContext("div", { defaultProps: { "aria-hidden": true } });

/**
 * Describes the props of Spacer: the props of a `div` element.
 */
export type SpacerProps = ComponentProps<typeof Spacer>;
