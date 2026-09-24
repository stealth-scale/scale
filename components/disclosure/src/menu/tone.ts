/**
 * Types the tone of a menu row.
 *
 * @remarks
 *   The tone is a prop of the row. A slot recipe resolves its variants once, at the root, and one
 *   row differs from the rest. The row sets the tone as `data-tone`, and the recipe's base styles
 *   the attribute.
 */

/**
 * Tone of a row: `critical` for a row that destroys or undoes something, in the error palette.
 */
export type Tone = "critical";
