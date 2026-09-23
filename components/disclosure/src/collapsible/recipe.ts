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
  onSlot,
  onSlots,
  statusEmitted,
  statusVariants,
  surface,
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
    root: { colorPalette: "neutral", width: "full" },
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
  defaultVariants: { motion: "slide", size: "md", status: "neutral", variant: "plain" },
  jsx: [/^Collapsible(\.\w+)?$/u],
  slots: ["root", "trigger", "content", "indicator"],
  staticCss: [statusEmitted()],
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
     * The palette the pair is drawn in.
     *
     * @remarks
     *   A block a page folds away is often a block about something: a warning it wants read before
     *   it is opened, a fault it wants kept out of the way until someone asks. The status points
     *   the palette and the looks read it, so one word turns the fill, the edge and what a press
     *   does, and no value here is a colour.
     *   `neutral` is the default and the one a page states nothing for, which is the grey every
     *   collapsible was drawn in before there was an axis at all.
     */
    status: onSlot("root", { ...statusVariants(), neutral: { colorPalette: "neutral" } }),

    /**
     * How the pair is set off from the page around it.
     *
     * @remarks
     *   The raised look is the theme's own surface fragment, which carries an elevation along with
     *   the panel colour and the line. Written out without one it was a line round a panel, and a
     *   panel on a page already that colour is a line round nothing: the raised look and the
     *   outlined look drew the same thing.
     *   Each look reads the palette the status points rather than a surface role, which is what
     *   lets one word tint the whole pair.
     */
    variant: {
      subtle: {
        root: { background: "colorPalette.subtle", borderRadius: "l2" },
        trigger: { _hover: { background: "colorPalette.muted" } },
      },

      surface: {
        root: surface(),
        trigger: {
          _open: { borderBlockEndColor: "colorPalette.border", borderBlockEndWidth: "hairline" },
        },
      },

      outline: {
        root: {
          borderColor: "colorPalette.border",
          borderRadius: "l2",
          borderWidth: "hairline",
        },
        trigger: {
          _open: { borderBlockEndColor: "colorPalette.border", borderBlockEndWidth: "hairline" },
        },
      },

      plain: { root: { borderWidth: "0" } },
    },
  },
});
