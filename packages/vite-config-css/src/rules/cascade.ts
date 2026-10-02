/**
 * Requires the cascade alone to settle a conflict between two rules.
 */

/**
 * Rejects the three constructs that settle a conflict outside the cascade.
 *
 * @remarks
 *   An author writes `!important` to override a rule elsewhere, and the next
 *   author has nothing left to override it with. Descending specificity and a
 *   duplicated selector each produce a block that never applies, and neither
 *   is visible at the line where it was written.
 */
export const CASCADE = {
  "declaration-no-important": true,
  "no-descending-specificity": true,
  "no-duplicate-selectors": true,
};
