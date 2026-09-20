/**
 * Defines the text styles: the sizes with the leading and tracking each is read at, and the roles
 * a recipe names instead of a size, as the foundation's statement draws them.
 */

import { type TextStyles } from "#pandacss.ts";
import { drawn } from "#preset/statement.ts";

/**
 * Lists the text styles: the sizes `2xs` to `9xl`, then the roles over them.
 */
export const textStyles: TextStyles = drawn.textStyles;
