/**
 * Renders inline code through the code recipe.
 *
 * @remarks
 *   The element is `code`. A code block with lines, a title and a copy control is `CodeBlock` in
 *   the content package.
 */

import { type ComponentProps } from "react";

import { withContext } from "#code/context.ts";

/**
 * Renders a `code` element with the classes of the code recipe.
 */
export const Code = withContext("code");

/**
 * Describes the props of Code: the recipe's variants and the props of a `code` element.
 */
export type CodeProps = ComponentProps<typeof Code>;
