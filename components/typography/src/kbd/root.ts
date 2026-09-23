/**
 * Renders one keycap through the kbd recipe.
 *
 * @remarks
 *   The element is `kbd`, the HTML element for user input. Inside `Kbd.Group` a keycap takes the
 *   group's size, look and palette, and a value set on the keycap takes precedence.
 */

import { type ComponentProps } from "react";

import { withContext } from "#kbd/context.ts";

/**
 * Renders a `kbd` element with the classes of the kbd recipe.
 */
export const Root = withContext("kbd");

/**
 * Describes the props of Kbd.Root: the recipe's variants and the props of a `kbd` element.
 */
export type RootProps = ComponentProps<typeof Root>;
