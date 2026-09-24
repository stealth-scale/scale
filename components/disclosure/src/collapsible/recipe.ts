/**
 * Recipe for the collapsible: a trigger that shows and hides the content beneath it, and an
 * indicator that turns as it does.
 *
 * @remarks
 *   The trigger takes the full width and places the indicator at its end, and reads the control
 *   scale, so its height matches a button of the same size. The content animates to the height the
 *   machine measures, with the theme's animation styles, so the theme settles reduced motion. The
 *   palette axis offers the eight palettes. The recipe has no `effect` axis, because the box holds
 *   content as well as the trigger, and a glow marks a control.
 */

import {
  controlSizes,
  defineSlotRecipe,
  iconSizes,
  insetSizes,
  interactive,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  surface,
} from "@stealthscale/theme/authoring";

/**
 * Defines the collapsible recipe: a plain collapsible at size `md` in the neutral palette, sliding
 * open, by default.
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
  defaultVariants: { motion: "slide", palette: "neutral", size: "md", variant: "plain" },
  jsx: [/^Collapsible(\.\w+)?$/u],
  slots: ["root", "trigger", "content", "indicator"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Animation of the content as it opens and closes.
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
     * Palette the looks read, set on the root.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Size of the trigger on the control scale, the indicator on the icon scale and the content's
     * padding on the inset scale.
     */
    size: onSlots({
      content: insetSizes(),
      indicator: iconSizes(),
      trigger: controlSizes(),
    }),

    /**
     * Look of the box around the trigger and the content.
     *
     * @remarks
     *   `surface` uses the theme's `surface()` fragment, with its shadow. Every look reads the
     *   palette, so the palette tints the fill and the edge.
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
