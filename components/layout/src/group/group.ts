/**
 * Renders a group through the group recipe.
 *
 * @remarks
 *   The element is `div`, which has no semantics. A group whose children are one set of choices
 *   sets `as="fieldset"` or a `role`, so a screen reader announces the set. The component renders
 *   no surface, ink or border.
 */

import { type ComponentProps } from "react";

import { withContext } from "#group/context.ts";

/**
 * Renders a `div` element with the classes of the group recipe.
 */
export const Group = withContext("div");

/**
 * Describes the props of Group: the recipe's variants and the props of a `div` element.
 */
export type GroupProps = ComponentProps<typeof Group>;
