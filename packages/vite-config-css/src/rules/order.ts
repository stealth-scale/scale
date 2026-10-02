/**
 * Fixes the order of the declarations inside a CSS block.
 */

/**
 * Sorts every declaration in a block alphabetically by property name.
 *
 * @remarks
 *   Alphabetical is arbitrary but total, and total is the point. Grouping by
 *   meaning reads better only to whoever did the grouping; two authors place
 *   the same property differently, which turns a one-line change into a
 *   reshuffled block at review.
 */
export const ORDER = {
  "order/properties-alphabetical-order": true,
};
