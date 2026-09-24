/**
 * Recipe for the tabs: a list of tabs, the panel of each, and the indicator under the selected
 * tab.
 *
 * @remarks
 *   The orientation is the machine's option, not an axis. The machine sets `data-orientation` on
 *   every part, so the list turns into a column and the line indicator moves to the inline edge
 *   without a second prop. The machine measures the selected tab into `--width` and `--height` and
 *   positions the indicator, so the recipe sets its size and fill and never its position. Every
 *   tab sits over the indicator, so a filled indicator does not cover the tab's text. The palette
 *   is set on the root, and the line and subtle looks read it. The recipe has no `effect` axis,
 *   because the indicator moves on every selection, and a glow would move with it.
 */

import {
  controlSizes,
  defineSlotRecipe,
  dense,
  insetSizes,
  interactive,
  justifyVariants,
  onSlot,
  onSlots,
  PALETTES,
  paletteVariants,
} from "@stealthscale/theme/authoring";

/**
 * Sizes an indicator that fills the selected tab to the tab's measured width and height.
 *
 * @remarks
 *   A line indicator takes one of the two and its own stroke for the other. A filled indicator
 *   takes both. Without them it collapsed to nothing and left the selected tab unmarked.
 */
const FILLED = { height: "var(--height)", width: "var(--width)" };

/**
 * Defines the tabs recipe: a line of tabs at size `md` by default.
 */
export const recipe = defineSlotRecipe({
  base: {
    content: { _focusVisible: { focusVisibleRing: "outside" }, outline: "none" },
    indicator: { borderRadius: "l1", pointerEvents: "none", zIndex: "0" },
    list: {
      _horizontal: { flexDirection: "row" },
      _vertical: { flexDirection: "column" },
      display: "flex",
      position: "relative",
    },
    root: {
      _horizontal: { flexDirection: "column" },
      _vertical: { flexDirection: "row" },
      display: "flex",
      width: "full",
    },
    trigger: {
      ...interactive(),
      _disabled: { cursor: "disabled" },
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
      position: "relative",
      whiteSpace: "nowrap",
      zIndex: "1",
    },
  },
  className: "tabs",
  defaultVariants: { size: "md", variant: "line" },
  jsx: [/^Tabs(\.\w+)?$/u],
  slots: ["root", "list", "trigger", "content", "indicator"],
  staticCss: [{ palette: [...PALETTES] }],
  variants: {
    /**
     * Whether the tabs share the list's width equally.
     */
    fitted: { true: { trigger: { flex: "1" } } },

    /**
     * Distribution of the tabs in a list wider than they are.
     */
    justify: onSlot("list", justifyVariants()),

    /**
     * Palette of the line indicator, the subtle indicator and the selected tab's text, set on the
     * root.
     */
    palette: onSlot("root", paletteVariants()),

    /**
     * Size of the tabs on the control scale and the panel's padding on the inset scale.
     */
    size: onSlots({ content: insetSizes(), trigger: controlSizes() }),

    /**
     * Look of the list and the indicator of the selected tab.
     */
    variant: {
      enclosed: {
        indicator: {
          ...FILLED,
          background: "bg.panel",
          borderColor: "border",
          borderWidth: "hairline",
        },
        list: { background: "bg.muted", borderRadius: "l2", padding: dense("{spacing.inset.xs}") },
        trigger: {
          _selected: { color: "fg" },
          borderRadius: "l1",
          color: "fg.muted",
        },
      },
      line: {
        indicator: {
          _horizontal: { bottom: "0", height: "{borderWidths.indicator}", width: "var(--width)" },
          _vertical: {
            height: "var(--height)",
            insetInlineStart: "0",
            width: "{borderWidths.indicator}",
          },
          background: "colorPalette.solid",
        },
        list: {
          _horizontal: { borderBlockEndColor: "border", borderBlockEndWidth: "hairline" },
          _vertical: { borderInlineEndColor: "border", borderInlineEndWidth: "hairline" },
        },
        trigger: {
          _hover: { color: "fg" },
          _selected: { color: "colorPalette.fg" },
          color: "fg.muted",
        },
      },
      plain: {
        indicator: { display: "none" },
        trigger: { _selected: { color: "fg" }, color: "fg.muted" },
      },
      subtle: {
        indicator: { ...FILLED, background: "colorPalette.subtle", borderRadius: "l1" },
        trigger: { _selected: { color: "colorPalette.fg" }, color: "fg.muted" },
      },
    },
  },
});
