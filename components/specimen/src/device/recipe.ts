/**
 * States what a device is: a row of pickers over one frame the size of the device a reader picked,
 * with the size written at the row's end.
 *
 * @remarks
 *   Five parts. The root stacks the row over the frame. The bar is the row: one picker per axis
 *   of the scene at its start, and the size at its end, wrapping where the room runs out. It is
 *   at least a small control tall before the pickers arrive, so their arrival moves nothing. A
 *   picker is a caption and the switcher beside it. The stage holds the frame and scrolls across
 *   where the device is wider than the card, because a device keeps its size or it is not that
 *   device, and keeps the room round the frame its outline is drawn in. The frame is the window,
 *   its edge a dashed hairline a gap outside its box, so the device's bounds can be seen against
 *   the card and nothing of the window is taken by the line: an outline rather than a border,
 *   because a border sits inside the size and shrinks the viewport the document inside sees. The
 *   frame is see-through, so the sample inside sits on the card the way it does on the page. Its
 *   size is read from two properties the root writes at run time, because the device's pixels
 *   are data rather than a theme's.
 */

import { defineSlotRecipe, dense } from "@stealthscale/theme/authoring";

/**
 * The property the root writes the frame's height in.
 */
export const HEIGHT = "--device-height";

/**
 * The property the root writes the frame's width in.
 */
export const WIDTH = "--device-width";

/**
 * Draws a device.
 */
export const recipe = defineSlotRecipe({
  base: {
    bar: {
      alignItems: "center",
      columnGap: dense("{spacing.gap.lg}"),
      display: "flex",
      flexWrap: "wrap",
      minBlockSize: dense("{sizes.control.sm}"),
      rowGap: dense("{spacing.gap.sm}"),
    },
    frame: {
      background: "transparent",
      blockSize: `var(${HEIGHT})`,
      display: "block",
      flexShrink: "0",
      inlineSize: `var(${WIDTH})`,
      outlineColor: "border.emphasized",
      outlineOffset: dense("{spacing.gap.xs}"),
      outlineStyle: "dashed",
      outlineWidth: "hairline",
    },
    picker: { alignItems: "center", display: "inline-flex", gap: dense("{spacing.gap.sm}") },
    root: {
      display: "flex",
      flexDirection: "column",
      gap: dense("{spacing.gap.md}"),
      maxInlineSize: "full",
      minInlineSize: "0",
    },
    size: { marginInlineStart: "auto" },
    stage: { maxInlineSize: "full", overflowX: "auto", padding: dense("{spacing.gap.sm}") },
  },
  className: "device",
  jsx: [/^Device(\.\w+)?$/u],
  slots: ["root", "bar", "picker", "size", "stage", "frame"],
});
