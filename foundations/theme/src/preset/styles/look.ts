/**
 * Describes one look as the compiler reads it: a name over a `value` holding the styles.
 */

import { type LayerStyle } from "#pandacss.ts";

/**
 * Describes one look as the compiler reads it.
 */
export type Look = Record<"value", LayerStyle>;
