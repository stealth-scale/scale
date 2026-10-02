/**
 * Recipe for the button that shows or hides a password input's value.
 *
 * @remarks
 *   The toggle is the only element the password input adds to the input group. The group draws the
 *   box, the field, the marks and every state. The toggle is the input group's square button from
 *   `input-group/trigger.ts`: the tag height at its size and never under 24px, the same square as
 *   the number input's steppers. The size comes from the root through the recipe's context, so the
 *   toggle and the box change size together. The recipe has no `palette` axis, because the toggle
 *   takes the field's muted ink.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

import { trigger, triggerSizes } from "#input-group/trigger.ts";

/**
 * Defines the toggle recipe: a square in the field's muted ink that fills on hover, at size `md` by
 * default.
 */
export const recipe = defineRecipe({
  base: trigger(),
  className: "password-input",
  defaultVariants: { size: "md" },
  jsx: [/^PasswordInput(\.\w+)?$/u],
  variants: {
    /**
     * Side of the square. Each value reads the tag scale at the same size, at least 24px.
     */
    size: triggerSizes(),
  },
});
