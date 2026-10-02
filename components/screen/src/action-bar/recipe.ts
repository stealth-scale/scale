/**
 * Styles the action bar, a panel fixed to the bottom of the window with the actions for what a
 * person has selected.
 *
 * @remarks
 *   The root has `display: contents`, because the positioner is fixed to the window and a slot
 *   recipe passes its variants from an ancestor. The positioner spans the window inside the inset
 *   and takes no pointer events, so the page around the bar remains pressable. The toolbar inside
 *   the bar is as wide as the bar, which is at least `sizes.2xl`, 672px. The toolbar folds when it
 *   is narrower than the `sm` breakpoint, 640px. The minimum width makes it fold on the width of
 *   the window and not on the width of its folded content. The recipe has no `palette` axis,
 *   because the bar reads the neutral `bg.panel`, and no `effect` axis, because the bar is not a
 *   control.
 */

import { axis, defineSlotRecipe, dense, motion, onSlot } from "@stealthscale/theme/authoring";

/**
 * Distance of the bar from the edges of the window.
 */
const OFFSET = "{spacing.inset.lg}";

/**
 * Places the bar may take along the bottom of the window, in the order a line reads them.
 */
const PLACEMENTS = ["bottom-start", "bottom", "bottom-end"] as const;

/**
 * Maps each placement to where the positioner puts the bar along its row.
 */
const ALIGNED = { bottom: "center", "bottom-end": "flex-end", "bottom-start": "flex-start" };

/**
 * Defines the action bar recipe, which places the bar in the middle of the bottom edge by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    closeTrigger: { flexShrink: "0" },
    content: {
      ...motion("sheet.bottom.in", "sheet.bottom.out"),
      background: "bg.panel",
      borderColor: "transparent",
      borderRadius: "l3",
      borderStyle: "solid",
      borderWidth: "hairline",
      boxShadow: "lg",
      color: "fg",
      inlineSize: "fit-content",
      maxInlineSize: "full",
      minInlineSize: "min(100%, {sizes.2xl})",
      padding: dense("{spacing.inset.xs}"),
      pointerEvents: "auto",
    },
    positioner: {
      display: "flex",
      insetBlockEnd: `calc({spacing.safe.bottom} + ${OFFSET})`,
      insetInline: "0",
      paddingInline: OFFSET,
      pointerEvents: "none",
      position: "fixed",
      zIndex: "banner",
    },
    root: { display: "contents" },
  },
  className: "action-bar",
  defaultVariants: { placement: "bottom" },
  jsx: [/^ActionBar(\.\w+)?$/u],
  slots: ["root", "positioner", "content", "closeTrigger"],
  variants: {
    /**
     * Place of the bar along the bottom of the window: at the start, in the middle or at the end.
     *
     * @remarks
     *   Start and end follow the writing direction.
     */
    placement: onSlot(
      "positioner",
      axis(PLACEMENTS, (placement) => ({ justifyContent: ALIGNED[placement] }))(),
    ),
  },
});
