/**
 * Returns the geometry and the cell states of the date picker: the side of a day's cell, the width
 * of a month's or a year's cell, the looks of a cell by its state, and the selector that widens the
 * last input's end padding while the clear trigger shows.
 *
 * @remarks
 *   A day's cell is 32, 36 or 40px from `sm` to `lg` and never under 24px at any density, the
 *   pointer target WCAG 2.5.8 sets. A month's or a year's cell is 1.75 days wide, four to a row.
 */

import { dense, type SystemStyleObject } from "@stealthscale/theme/authoring";

import { type Size } from "#dropdown.ts";

/**
 * Class name of the recipe, from which the binding writes each part's class.
 */
export const CLASS = "date-picker";

/**
 * Selects the last input of a control whose clear trigger shows, the input the triggers cover.
 */
export const CLEARED = `.${CLASS}__control:has(> .${CLASS}__clearTrigger:not([hidden])) > &:last-of-type`;

/**
 * Selects the last input of a control, the input the trigger covers.
 */
export const LAST = `&:last-of-type`;

/**
 * Sides of a day's cell per size, from the size scale.
 */
const CELLS: Record<Size, string> = { lg: "10", md: "9", sm: "8" };

/**
 * Returns the side of a day's cell at a size, never under 24px.
 */
export function cellSide(size: Size): string {
  return `max({sizes.6}, ${dense(`{sizes.${CELLS[size]}}`)})`;
}

/**
 * Returns the width of a month's or a year's cell at a size: 1.75 days.
 */
export function wideCell(size: Size): string {
  return `calc(${cellSide(size)} * 1.75)`;
}

/**
 * Selects a cell in the selected range, or in the range a pointer previews.
 */
const RANGED = "&[data-in-range], &[data-in-hover-range]";

/**
 * Selects a selected cell.
 */
const SELECTED = "&[data-selected]";

/**
 * Fills a cell with the system's highlight under forced colors.
 */
const FORCED: SystemStyleObject = {
  _highContrast: { background: "Highlight", color: "HighlightText", forcedColorAdjust: "none" },
};

/**
 * Returns the look of a cell in a range under its selector: the palette's subtle fill, square so
 * the cells of a range join, and the system's highlight under forced colors.
 *
 * @remarks
 *   The hover fill is as specific as the forced fill under a pointer, and the compiler emits the
 *   `(hover: hover)` block after the `(forced-colors: active)` block. The hover restates the forced
 *   fill under the state's selector, which makes it more specific than the hover fill. The selected
 *   cell's look does the same.
 */
function ranged(): SystemStyleObject {
  return {
    [RANGED]: {
      ...FORCED,
      _hover: { background: "colorPalette.muted", [RANGED]: FORCED },
      background: "colorPalette.subtle",
      borderRadius: "0",
      color: "colorPalette.fg",
    },
  };
}

/**
 * Returns the look of a selected cell under its selector: the palette's solid and its contrast
 * ink, and the system's highlight under forced colors.
 */
function selected(): SystemStyleObject {
  return {
    [SELECTED]: {
      ...FORCED,
      _focusVisible: { outlineOffset: "calc({borderWidths.ring} * -2)" },
      _hover: { background: "colorPalette.solid", [SELECTED]: FORCED },
      background: "colorPalette.solid",
      color: "colorPalette.contrast",
      focusRingColor: "colorPalette.contrast",
    },
  };
}

/**
 * Returns the looks of a cell by its state: today, outside the visible month, unavailable, in a
 * range, at a range's ends, and selected.
 *
 * @remarks
 *   A range's look is written first and a selected cell's last, so a range's ends round their outer
 *   corners and keep the solid fill. A day outside the visible month is hidden unless a person can
 *   select it, as MUI and React Aria render them, and keeps its place in the grid. An unavailable
 *   day takes the disabled look the machine's `data-disabled` gives it, and a line through it.
 */
export function cellStates(): SystemStyleObject {
  return {
    ...ranged(),
    "&[data-outside-range]": { color: "fg.muted" },
    "&[data-outside-range]:not([data-selectable])": { visibility: "hidden" },
    "&[data-range-end]": { borderEndEndRadius: "l2", borderStartEndRadius: "l2" },
    "&[data-range-start]": { borderEndStartRadius: "l2", borderStartStartRadius: "l2" },
    "&[data-today]": {
      fontWeight: "semibold",
      textDecorationLine: "underline",
      textDecorationThickness: "0.1em",
      textUnderlineOffset: "0.25em",
    },
    "&[data-unavailable]": { textDecorationLine: "line-through" },
    ...selected(),
  };
}
