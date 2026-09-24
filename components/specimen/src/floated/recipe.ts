/**
 * Styles the floated box: a layout containment boundary, padded by the room its open floating
 * content needs.
 *
 * @remarks
 *   `contain: layout` makes the box the containing block of the absolutely positioned positioners
 *   inside it. Each padding reads a custom property the box sets after it measures the positioners,
 *   and each property defaults to zero.
 */

import { defineRecipe } from "@stealthscale/theme/authoring";

/**
 * Custom properties the box sets to the padding each side needs.
 */
export const ROOM = {
  blockEnd: "--floated-block-end",
  blockStart: "--floated-block-start",
  inlineEnd: "--floated-inline-end",
  inlineStart: "--floated-inline-start",
} as const;

/**
 * Defines the floated recipe: a contained block, padded from the four custom properties.
 */
export const recipe = defineRecipe({
  base: {
    contain: "layout",
    display: "block",
    inlineSize: "full",
    paddingBlockEnd: `var(${ROOM.blockEnd}, 0px)`,
    paddingBlockStart: `var(${ROOM.blockStart}, 0px)`,
    paddingInlineEnd: `var(${ROOM.inlineEnd}, 0px)`,
    paddingInlineStart: `var(${ROOM.inlineStart}, 0px)`,
  },
  className: "floated",
  jsx: [/^Floated$/u],
});
