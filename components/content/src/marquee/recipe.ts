/**
 * Recipe for a marquee: a strip of items that moves across or down in a loop, fading at its ends,
 * with a control that pauses it.
 *
 * @remarks
 *   The root is a row or a column by the machine's orientation and places the pause control over
 *   the strip's end. The viewport clips the moving copies. Each copy moves a whole copy back or
 *   forward with the theme's `marquee-x` or `marquee-y` motion, at the duration, delay and loop
 *   count the machine writes on the root, reversed under `data-reverse` and held while the root is
 *   `data-paused`. Under reduced motion the copies rest and the pause control is hidden. The space
 *   between items is the `gap` axis's step, which the machine reads as `--marquee-spacing`. An edge
 *   part makes the viewport mask that end of the strip from transparent to opaque over a fifth of
 *   the marquee, so the items fade into whatever the marquee sits on. The recipe has no `palette`
 *   axis, because a marquee has no colour of its own, and no `effect` axis, because it is not a
 *   control.
 */

import { defineSlotRecipe, onSlot, sizeVariants } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which a selector across its parts writes.
 */
export const CLASS = "marquee";

/**
 * Custom property the machine reads for the space between items, which the root sets from `gap`.
 */
export const SPACING = "--marquee-spacing";

/**
 * Length of an edge's fade along the strip: a fifth of the marquee.
 */
const FADE = "calc({sizes.full} / 5)";

/**
 * Selects a part of a marquee that moves across.
 */
const ACROSS = "&[data-orientation=horizontal]";

/**
 * Selects a part of a marquee that moves down.
 */
const DOWN = "&[data-orientation=vertical]";

/**
 * Selects the pause control of a marquee that moves across, which reads its root's orientation.
 */
const CONTROL_ACROSS = `.${CLASS}__root[data-orientation=horizontal] > &`;

/**
 * Selects the pause control of a marquee that moves down.
 */
const CONTROL_DOWN = `.${CLASS}__root[data-orientation=vertical] > &`;

/**
 * Selects a root that contains the pause control.
 */
const CONTROLLED = `&:has(> .${CLASS}__pauseTrigger)`;

/**
 * Selects a copy while its marquee is paused.
 */
const HELD = `.${CLASS}__root[data-paused] > .${CLASS}__viewport > &`;

/**
 * Timing of a copy's motion from the variables the machine writes on the root, stated after the
 * motion so it applies over the motion's pace, at the same specificity as the motion's selector.
 */
const TIMED = {
  animationDelay: "var(--marquee-delay)",
  animationDuration: "var(--marquee-duration)",
  animationIterationCount: "var(--marquee-loop-count)",
};

/**
 * Steps of the space between items.
 */
const GAPS = ["xs", "sm", "md", "lg", "xl"] as const;

/**
 * Lists each side an edge fades, with the custom property on the viewport that holds its length.
 */
const SIDES = [
  ["start", "--marquee-fade-start"],
  ["end", "--marquee-fade-end"],
  ["top", "--marquee-fade-top"],
  ["bottom", "--marquee-fade-bottom"],
] as const;

/**
 * Returns a mask gradient opaque between the two fades and transparent at the strip's ends.
 *
 * @param towards - The direction of the gradient, from the strip's first end.
 * @param first - The custom property with the fade's length at the first end.
 * @param last - The custom property with the fade's length at the last end.
 */
function masked(towards: string, first: string, last: string): string {
  return `linear-gradient(${towards}, transparent, #000 var(${first}, 0px), #000 calc(100% - var(${last}, 0px)), transparent)`;
}

/**
 * Returns the viewport's fade lengths: a fifth of the marquee at each side an edge part names.
 */
function faded(): Record<string, Record<string, string>> {
  return Object.fromEntries(
    SIDES.map(([side, length]) => [
      `.${CLASS}__root:has(> .${CLASS}__edge[data-side=${side}]) > &`,
      { [length]: FADE },
    ]),
  );
}

/**
 * Defines the marquee recipe, which spaces items by the `md` gap by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: {
      _motionSafe: TIMED,
      "&[data-reverse]": { animationDirection: "reverse" },
      [ACROSS]: { alignItems: "center", minInlineSize: "max" },
      animationFillMode: "forwards",
      animationStyle: "marquee-x",
      [DOWN]: { _motionSafe: TIMED, animationStyle: "marquee-y", minBlockSize: "max" },
      [HELD]: { animationPlayState: "paused" },
    },
    edge: { pointerEvents: "none" },
    item: { flexShrink: "0" },
    pauseTrigger: {
      _motionReduce: { display: "none" },
      [CONTROL_ACROSS]: { insetInlineEnd: "{spacing.gap.xs}", top: "50%", translate: "0 -50%" },
      [CONTROL_DOWN]: { bottom: "{spacing.gap.xs}", left: "50%", translate: "-50% 0" },
      position: "absolute",
      zIndex: "docked",
    },
    root: {
      [ACROSS]: { flexDirection: "row" },
      [CONTROLLED]: { minBlockSize: "{sizes.control.xs}" },
      display: "flex",
      [DOWN]: { blockSize: "full", flexDirection: "column" },
      inlineSize: "full",
      position: "relative",
    },
    viewport: {
      ...faded(),
      [ACROSS]: {
        _rtl: { maskImage: masked("to left", "--marquee-fade-start", "--marquee-fade-end") },
        maskImage: masked("to right", "--marquee-fade-start", "--marquee-fade-end"),
      },
      [DOWN]: { maskImage: masked("to bottom", "--marquee-fade-top", "--marquee-fade-bottom") },
      overflow: "hidden",
    },
  },
  className: CLASS,
  defaultVariants: { gap: "md" },
  jsx: [/^Marquee(\.\w+)?$/u],
  slots: ["root", "viewport", "content", "item", "edge", "pauseTrigger"],
  variants: {
    /**
     * Space between two items, a step of the gap scale.
     */
    gap: onSlot(
      "root",
      sizeVariants((gap) => ({ [SPACING]: `{spacing.gap.${gap}}` }), GAPS),
    ),
  },
});
