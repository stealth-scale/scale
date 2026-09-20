/**
 * States what a transfer is: two lists side by side and the pair of controls that move rows between
 * them.
 *
 * @remarks
 *   Four parts. The root lays the two sides and the controls along one line, a side holds one list,
 *   the controls are the column between them, and a control is one square in that column.
 *   A control is a square holding one mark and no words, drawn from the control scale a step below
 *   the list's size, so it reads as the smaller thing beside two lists rather than a third list.
 *   Both sides take the same share of the width, so the pair keeps still as rows cross between
 *   them. A side that took its own width would step sideways every time the longest name moved.
 *   Both take the same height as well. A side is a grid of one, which stretches the list inside it
 *   to whatever the pair comes to, and the pair comes to whichever side is taller. The floor under
 *   that is the room every row would take, which each list counts off the row height it publishes,
 *   so an empty side is as tall as a full one.
 *   The controls sit against the middle of the pair rather than the top. They act on whichever side
 *   a reader has picked from, and a control pinned to the top of a tall pair reads as belonging to
 *   the first row of it.
 */

import {
  below,
  defineSlotRecipe,
  dense,
  interactive,
  onSlots,
  sizeVariants,
} from "@stealthscale/theme/authoring";

/**
 * Draws a transfer at the middle size until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    control: {
      ...interactive(),
      _disabled: { layerStyle: "disabled" },
      alignItems: "center",
      borderColor: "border",
      borderRadius: "l2",
      borderStyle: "solid",
      borderWidth: "hairline",
      color: "fg.muted",
      display: "inline-flex",
      justifyContent: "center",
    },
    controls: {
      alignItems: "center",
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      flexShrink: "0",
    },
    root: { alignItems: "stretch", display: "flex", minInlineSize: "0" },
    side: { display: "grid", flex: "1", minInlineSize: "0" },
  },
  className: "transfer",
  defaultVariants: { size: "md" },
  jsx: [/^Transfer(\.\w+)?$/u],
  slots: ["root", "side", "controls", "control"],
  variants: {
    size: onSlots({
      control: sizeVariants(
        (size) => ({
          "& > *": { boxSize: dense(`{sizes.icon.${below(size)}}`) },
          boxSize: dense(`{sizes.control.${below(size)}}`),
        }),
        ["sm", "md", "lg"],
      ),
      controls: sizeVariants(
        (size) => ({ gap: dense(`{spacing.gap.${below(size)}}`) }),
        ["sm", "md", "lg"],
      ),
      root: sizeVariants((size) => ({ gap: dense(`{spacing.gap.${size}}`) }), ["sm", "md", "lg"]),
    }),
  },
});
