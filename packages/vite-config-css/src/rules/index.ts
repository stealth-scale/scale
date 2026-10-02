/**
 * Gathers the rule sets kept in this directory into the one record Stylelint
 * is configured with.
 */

import { ANIMATION } from "#rules/animation.ts";
import { CASCADE } from "#rules/cascade.ts";
import { ORDER } from "#rules/order.ts";
import { SELECTOR } from "#rules/selector.ts";

export { ANIMATION } from "#rules/animation.ts";
export { CASCADE } from "#rules/cascade.ts";
export { ORDER } from "#rules/order.ts";
export { SELECTOR } from "#rules/selector.ts";

/**
 * Merges the four rule sets into the record the check hands Stylelint.
 *
 * @remarks
 *   No rule name appears in two sets, so the merge overrides nothing and the
 *   result holds as many entries as the four sets together. A rule the shared
 *   guide already turns on belongs in none of the sets, and a repository adds
 *   its own through `Checked.rules`.
 * @returns Every rule the check turns on, keyed by Stylelint rule name.
 */
export function all(): Record<string, unknown> {
  return { ...SELECTOR, ...CASCADE, ...ORDER, ...ANIMATION };
}
