/**
 * Styles a key combination: the keycaps of one shortcut in a row.
 *
 * @remarks
 *   The group renders no box of its own. Its keycaps are 4px apart at the foundation's metrics, and
 *   the row does not wrap, so a shortcut never breaks across two lines.
 */

import { defineRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * Lays the keycaps in one row with the `xs` gap between them.
 */
export const recipe = defineRecipe({
  base: {
    alignItems: "center",
    display: "inline-flex",
    gap: dense("{spacing.gap.xs}"),
    whiteSpace: "nowrap",
  },
  className: "kbd-group",
  jsx: [/^Kbd\.Group$/u],
});
