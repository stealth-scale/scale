/**
 * Recipe for the buttons that step a number input's value.
 *
 * @remarks
 *   The triggers are the only elements the number input adds to the input group. The group draws
 *   the box, the field, the marks and every state. A trigger is the input group's square button
 *   from `input-group/trigger.ts`: the tag height at its size and never under 24px, the same square
 *   as the password input's visibility toggle and the search input's clear control. The size comes
 *   from the root through the recipe's context, so the triggers and the box change size together. A
 *   trigger at a bound is disabled and is transparent on hover. The recipe has no `palette` axis,
 *   because the triggers take the field's muted ink.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

import { trigger, triggerSizes } from "#input-group/trigger.ts";

/**
 * Defines the trigger recipe: a square in the field's muted ink that fills on hover, at size `md`
 * by default.
 */
export const recipe = defineRecipe({
  base: trigger(),
  className: "number-input",
  defaultVariants: { size: "md" },
  jsx: [/^NumberInput(\.\w+)?$/u],
  variants: {
    /**
     * Side of the square. Each value reads the tag scale at the same size, at least 24px.
     */
    size: triggerSizes(),
  },
});
