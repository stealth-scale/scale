/**
 * States what a collapsible is: a control that shows and hides the block beneath it.
 *
 * @remarks
 *   Four parts. The root frames the pair, the trigger is what a person presses, the content is what
 *   appears, and the indicator is the mark that turns as it does.
 *   The trigger fills the width it is given and pushes its indicator to the end, because a
 *   disclosure is read as a row and a mark floating beside the words reads as part of them. It
 *   reads the control scale, so a collapsible lines up with a button of the same name beside it.
 *   The content animates from the height the machine measures. Both motions are animation styles
 *   the theme owns, so a reader who asked for less motion is answered in the theme rather than
 *   here, and the height the animation runs to is a custom property the machine sets.
 */

import {
  controlSizes,
  defineSlotRecipe,
  iconSizes,
  insetSizes,
  interactive,
  onSlots,
} from "@stealthscale/theme/authoring";

/**
 * Draws an unframed collapsible at the middle size, sliding open, until a caller says otherwise.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { overflow: "hidden" },
    indicator: {
      _motionReduce: { transitionDuration: "none" },
      _open: { rotate: "180deg" },
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      transitionDuration: "press",
      transitionProperty: "rotate",
      transitionTimingFunction: "press",
    },
    root: { width: "full" },
    trigger: {
      ...interactive(),
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between",
      textAlign: "start",
      width: "full",
    },
  },
  className: "collapsible",
  defaultVariants: { motion: "slide", size: "md", variant: "plain" },
  jsx: [/^Collapsible(\.\w+)?$/u],
  slots: ["root", "trigger", "content", "indicator"],
  variants: {
    /**
     * How the block appears and goes.
     */
    motion: {
      fade: {
        content: { _closed: { animationStyle: "fade.out" }, _open: { animationStyle: "fade.in" } },
      },
      none: { content: { animation: "none" } },
      slide: {
        content: {
          _closed: { animationStyle: "collapse.out" },
          _open: { animationStyle: "collapse.in" },
        },
      },
    },

    /**
     * How much room the pair takes, which the trigger, the block and the mark step together.
     */
    size: onSlots({
      content: insetSizes(),
      indicator: iconSizes(),
      trigger: controlSizes(),
    }),

    /**
     * How the pair is set off from the page around it.
     */
    variant: {
      outline: {
        root: { borderColor: "border", borderRadius: "l2", borderWidth: "hairline" },
        trigger: { _open: { borderBlockEndColor: "border", borderBlockEndWidth: "hairline" } },
      },
      plain: { root: { borderWidth: "0" } },
      subtle: {
        root: { background: "bg.muted", borderRadius: "l2" },
        trigger: { _hover: { background: "bg.emphasized" } },
      },
      surface: {
        root: {
          background: "bg.panel",
          borderColor: "border",
          borderRadius: "l2",
          borderWidth: "hairline",
        },
        trigger: { _open: { borderBlockEndColor: "border", borderBlockEndWidth: "hairline" } },
      },
    },
  },
});
