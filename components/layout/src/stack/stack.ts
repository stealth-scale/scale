/**
 * Renders a stack through the stack recipe.
 *
 * @remarks
 *   The element is `div`, which has no semantics. A stack of list items sets `as="ul"`, so a
 *   screen reader counts them. The component renders no surface, ink or border.
 */

import { type ComponentProps } from "react";

import { withContext } from "#stack/context.ts";

/**
 * Renders a `div` element with the classes of the stack recipe.
 */
export const Stack = withContext("div");

/**
 * Describes the props of Stack: the recipe's variants and the props of a `div` element.
 */
export type StackProps = ComponentProps<typeof Stack>;
