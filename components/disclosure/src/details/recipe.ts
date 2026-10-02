/**
 * Recipe for the details: a native `details` element whose summary shows and hides the content
 * under it, and an indicator that turns a quarter as it opens.
 *
 * @remarks
 *   The browser opens and closes the element, so every open style keys on the root's `open`
 *   attribute. The summary drops the browser's marker and is a control's height for one line, and
 *   a summary that wraps grows. The indicator goes before the words and turns a quarter
 *   clockwise, and a quarter the other way under `dir="rtl"`, for a chevron that points to the
 *   end. The looks and the palette are the collapsible's, so a details beside a collapsible looks
 *   the same.
 */

import {
  defineSlotRecipe,
  dense,
  iconSizes,
  insetSizes,
  interactive,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
  sizeVariants,
  surface,
} from "@stealthscale/theme/authoring";

/**
 * Selects the summary of an open details.
 */
export const OPENED = ".details__root[open] > &";

/**
 * Selects a part inside the summary of an open details.
 */
export const OPEN_SUMMARY = ".details__root[open] > .details__summary > &";

/**
 * Defines the details recipe: an outlined details at size `md` in the neutral palette by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    indicator: {
      _motionReduce: { transitionDuration: "none" },
      "& svg": { boxSize: "full" },
      alignItems: "center",
      display: "inline-flex",
      flexShrink: "0",
      justifyContent: "center",
      [OPEN_SUMMARY]: { _rtl: { rotate: "-90deg" }, rotate: "90deg" },
      transitionDuration: "press",
      transitionProperty: "rotate",
      transitionTimingFunction: "press",
    },
    root: { width: "full" },
    summary: {
      ...interactive(),
      "&::-webkit-details-marker": { display: "none" },
      alignItems: "center",
      display: "flex",
      fontWeight: "medium",
      listStyle: "none",
      textAlign: "start",
    },
  },
  className: "details",
  defaultVariants: { palette: "neutral", size: "md", variant: "outline" },
  jsx: [/^Details(\.\w+)?$/u],
  slots: ["root", "summary", "indicator", "content"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Palette the looks read, set on the root.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Size of the summary, the indicator on the icon scale and the content's padding on the inset
     * scale.
     *
     * @remarks
     *   The summary pads its ends by half of a control's height less its tallest line, one line of
     *   text or the indicator, and is at least a control's height. A one-line summary is then a
     *   collapsible trigger's height at the same size, and a longer one grows by its lines. It pads
     *   its sides on the inset scale.
     */
    size: onSlots({
      content: insetSizes(),
      indicator: iconSizes(),
      summary: sizeVariants((size) => ({
        gap: dense(`{spacing.gap.${size}}`),
        minBlockSize: dense(`{sizes.control.${size}}`),
        paddingBlock: `calc((${dense(`{sizes.control.${size}}`)} - max(1lh, ${dense(`{sizes.icon.${size}}`)})) / 2)`,
        paddingInline: dense(`{spacing.inset.${size}}`),
        textStyle: `label.${size}`,
      })),
    }),

    /**
     * Look of the box around the summary and the content.
     *
     * @remarks
     *   The looks are the collapsible's. The subtle summary takes the root's radius, so its hover
     *   fill follows the root's corners, and its end corners are square while the content is open
     *   under it. Under forced colors the subtle box, which the browser's fill replaces, takes a
     *   `CanvasText` hairline outline. The plain look draws no box and pads no side, so its summary
     *   and content line up with the text around them.
     */
    variant: {
      subtle: {
        root: {
          _highContrast: {
            outlineColor: "CanvasText",
            outlineOffset: "calc({borderWidths.hairline} * -1)",
            outlineStyle: "solid",
            outlineWidth: "hairline",
          },
          background: "colorPalette.subtle",
          borderRadius: "l2",
        },
        summary: {
          _hover: { background: "colorPalette.muted" },
          borderRadius: "l2",
          [OPENED]: { borderEndEndRadius: "0", borderEndStartRadius: "0" },
        },
      },

      surface: {
        root: surface(),
        summary: {
          [OPENED]: { borderBlockEndColor: "colorPalette.muted", borderBlockEndWidth: "hairline" },
        },
      },

      outline: {
        root: {
          borderColor: "colorPalette.muted",
          borderRadius: "l2",
          borderWidth: "hairline",
        },
        summary: {
          [OPENED]: { borderBlockEndColor: "colorPalette.muted", borderBlockEndWidth: "hairline" },
        },
      },

      plain: {
        content: { paddingInline: "0" },
        root: { borderWidth: "0" },
        summary: { paddingInline: "0" },
      },
    },
  },
});
