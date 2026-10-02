/**
 * Renders a strong run through the strong recipe.
 *
 * @remarks
 *   `strong` marks importance and exposes the `strong` role, so the meaning does not depend on the
 *   weight. `as="b"` renders a bold run with no importance, such as a keyword in a definition.
 */

import { type ComponentProps } from "react";

import { withContext } from "#strong/context.ts";

/**
 * Renders a `strong` element with the classes of the strong recipe.
 */
export const Strong = withContext("strong");

/**
 * Describes the props of Strong: the recipe's variants and the props of a `strong` element.
 */
export type StrongProps = ComponentProps<typeof Strong>;
