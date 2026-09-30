/**
 * Recipe for the phone input's country picker: a button in the input group's addon with the
 * country's glyph, its calling code and the caller's indicator, and the picker's label and the
 * country's name for a screen reader alone.
 *
 * @remarks
 *   The button reads the input group's square trigger: the field's muted ink, a fill under the
 *   pointer and while pressed, and a focus ring of its own, because a focused button does not ring
 *   the group's box. It is as tall as the square at the group's size and at least 24px, the WCAG
 *   2.5.8 target size, and it inherits the group's text, so the calling code matches the number
 *   beside it. The calling code takes the text ink and tabular figures. The recipe has no
 *   `palette` or `effect` axis, because the picker is part of a field.
 */

import { defineSlotRecipe, dense, onSlot, sizeVariants } from "@stealthscale/theme/authoring";

import { trigger, triggerSide } from "#input-group/trigger.ts";

/**
 * Defines the phone input recipe at size `md`.
 */
export const recipe = defineSlotRecipe({
  base: {
    dial: { color: "fg", fontVariantNumeric: "tabular-nums" },
    flag: { alignItems: "center", display: "inline-flex", flexShrink: "0" },
    indicator: { alignItems: "center", display: "inline-flex", flexShrink: "0" },
    label: { srOnly: true },
    name: { srOnly: true },
    trigger: {
      ...trigger(),
      columnGap: dense("{spacing.gap.xs}"),
      font: "inherit",
      paddingInline: dense("{spacing.gap.xs}"),
    },
  },
  className: "phone-input",
  defaultVariants: { size: "md" },
  jsx: [/^PhoneInput(\.\w+)?$/u],
  slots: ["picker", "label", "trigger", "flag", "name", "dial", "indicator"],
  variants: {
    /**
     * Height of the button: the input group's square trigger at the group's size.
     */
    size: onSlot(
      "trigger",
      sizeVariants((size) => ({
        blockSize: triggerSide(size),
        minInlineSize: triggerSide(size),
      })),
    ),
  },
});
