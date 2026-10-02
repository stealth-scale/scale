/**
 * Declares the swipe actions' slot recipe: a row whose content slides aside to reveal actions at
 * its inline end.
 *
 * @remarks
 *   The root clips its row. The content is a padded flex row that moves towards the inline start by
 *   the width the root states in `--swipe-reveal`, and the actions are clipped to that width at the
 *   inline end, so the actions take no room and show nothing at rest, whatever the row's
 *   background. Both move over the `move` duration and easing, with no transition while a finger
 *   drags the row or under reduced motion. The content takes `touch-action: pan-y`, so a vertical
 *   swipe scrolls the page and a horizontal one moves the row. An action is square, at least as
 *   tall as the row and `sizes.16` wide, with its glyph above its words. Its focus ring is inside
 *   it in the palette's contrast ink, because the row clips a ring drawn outside the action.
 */

import { defineSlotRecipe, dense, type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Class name of the recipe, which a selector across parts reads.
 */
const CLASS = "swipe-actions";

/**
 * Custom property the root sets to the revealed width of the actions, in pixels.
 */
export const REVEAL = "--swipe-reveal";

/**
 * Reads the revealed width.
 */
const REVEALED = `var(${REVEAL})`;

/**
 * Turns a part's transition off while a finger or a trackpad drags the row.
 */
const STILL: SystemStyleObject = { "[data-dragging] > &": { transitionDuration: "0s" } };

/**
 * Styles the swipe actions' row, content and actions.
 */
export const recipe = defineSlotRecipe({
  base: {
    action: {
      flexDirection: "column",
      flexShrink: "0",
      minBlockSize: "full",
      minInlineSize: "{sizes.16}",
    },
    actions: {
      ...STILL,
      _motionSafe: {
        transitionDuration: "move",
        transitionProperty: "clip-path",
        transitionTimingFunction: "move",
      },
      _rtl: { clipPath: `inset(0 calc(100% - ${REVEALED}) 0 0)` },
      [`& > .${CLASS}__action`]: {
        _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -2)" },
        borderRadius: "none",
        focusRingColor: "colorPalette.contrast",
        focusVisibleRing: "inside",
      },
      alignItems: "stretch",
      clipPath: `inset(0 0 0 calc(100% - ${REVEALED}))`,
      display: "flex",
      insetBlock: "0",
      insetInlineEnd: "0",
      position: "absolute",
    },
    content: {
      ...STILL,
      _motionSafe: {
        transitionDuration: "move",
        transitionProperty: "translate",
        transitionTimingFunction: "move",
      },
      _rtl: { translate: `${REVEALED} 0` },
      alignItems: "center",
      display: "flex",
      gap: dense("{spacing.gap.md}"),
      minBlockSize: dense("{sizes.control.lg}"),
      paddingBlock: dense("{spacing.inset.sm}"),
      paddingInline: dense("{spacing.inset.md}"),
      position: "relative",
      touchAction: "pan-y",
      translate: `calc(${REVEALED} * -1) 0`,
    },
    root: {
      _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -1)" },
      focusVisibleRing: "inside",
      overflow: "clip",
      position: "relative",
    },
  },
  className: CLASS,
  jsx: [/^SwipeActions\.\w+$/u],
  slots: ["root", "content", "actions", "action"],
});
