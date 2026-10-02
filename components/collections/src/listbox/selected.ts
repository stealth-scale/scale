/**
 * Declares the listbox's `selected` axis: the fill of a selected row per look, and the row's
 * colors under forced colors.
 *
 * @remarks
 *   Forced colors replace every fill, so a selected row fills with `Highlight` and opts out of
 *   forced colors in every look but `none`, whose checkboxes show the state. The row's parts
 *   inherit the opt-out, so each part of the listbox with an ink of its own restates its ink on the
 *   fill: the description reads `HighlightText`, and a checked box fills with `HighlightText`
 *   around a `Highlight` mark.
 */

import { type SystemStyleObject } from "@stealthscale/theme/authoring";

/**
 * Selector of a selected row's description, written with the class the listbox binds on a row.
 */
export const DESCRIBED = ".listbox__item[data-selected] &";

/**
 * Fills a selected row with `Highlight` under forced colors.
 */
const FORCED = {
  _highContrast: { background: "Highlight", color: "HighlightText", forcedColorAdjust: "none" },
};

/**
 * Restates the forced colors on a selected row under a pointer.
 *
 * @remarks
 *   A look's hover fill on a selected row is as specific as the forced colors, and the compiler
 *   emits the `(hover: hover)` block after the `(forced-colors: active)` block, so the fill applies
 *   over the forced colors. The restatement repeats the selected state's selector, which makes it
 *   more specific than the fill.
 */
const FORCED_HOVER = { _selected: FORCED };

/**
 * Draws the highlight's line on a selected row in `HighlightText` under forced colors. The line is
 * `Highlight` on every other row, the color of the selected row's fill.
 */
const FOUND = { _highContrast: { outlineColor: "HighlightText" } };

/**
 * Writes a look that fills a selected row, with the forced inks of the row's checkbox and
 * description on the fill.
 *
 * @param selected - Styles of a selected row in the look.
 */
function filled(
  selected: SystemStyleObject,
): Record<"item" | "itemCheckbox" | "itemDescription", SystemStyleObject> {
  return {
    item: { _selected: { ...FORCED, _highlighted: FOUND, ...selected } },
    itemCheckbox: {
      "[data-selected] > &": {
        _highContrast: {
          background: "HighlightText",
          borderColor: "HighlightText",
          color: "Highlight",
        },
      },
    },
    itemDescription: { [DESCRIBED]: { _highContrast: { color: "HighlightText" } } },
  };
}

/**
 * Fill of a selected row per look. The solid and subtle looks restate their hover, because a
 * variant applies over the base hover.
 */
export const SELECTED = {
  none: { item: { _selected: { fontWeight: "inherit" } } },
  plain: filled({ fontWeight: "medium" }),
  solid: filled({
    _hover: { ...FORCED_HOVER, background: "colorPalette.solid.hover" },
    layerStyle: "flat.solid",
  }),
  subtle: filled({
    _hover: { ...FORCED_HOVER, background: "colorPalette.muted" },
    layerStyle: "flat.subtle",
  }),
};
