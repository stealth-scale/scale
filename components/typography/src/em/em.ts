/**
 * Renders a stressed run through the em recipe.
 *
 * @remarks
 *   `em` marks stress and exposes the `emphasis` role, so the meaning does not depend on the italic
 *   face. `as="i"` renders an italic run with no stress, such as a product name or a term.
 */

import { type ComponentProps } from "react";

import { withContext } from "#em/context.ts";

/**
 * Renders an `em` element with the classes of the em recipe.
 */
export const Em = withContext("em");

/**
 * Describes the props of Em: the recipe's variants and the props of an `em` element.
 */
export type EmProps = ComponentProps<typeof Em>;
