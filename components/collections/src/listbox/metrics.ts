/**
 * Returns the geometry the listbox recipe is written from: the list's padding, the insets that put
 * a band's and a label's text on the rows' text line, and one row's height.
 */

import {
  below,
  columnCounts,
  type Count,
  COUNTS,
  dense,
  type Scale,
  type SystemStyleObject,
} from "@stealthscale/theme/authoring";

/**
 * Padding of the list around its rows, in every look.
 *
 * @remarks
 *   A row needs room around it for the highlight's corners, so the list keeps the padding on a
 *   plain look too.
 */
export const PAD = "{spacing.gap.xs}";

/**
 * Custom property the list sets to one row's height.
 */
export const ROW_HEIGHT = "--listbox-row";

/**
 * Returns one style per column count: the count's template and `display: grid`.
 *
 * @remarks
 *   The list is a flex column until a caller sets a count, so each value also sets the display.
 */
export function tiled(): Record<Count, SystemStyleObject> {
  const columned = columnCounts();

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the entries are built from the counts, one per count
  return Object.fromEntries(
    COUNTS.map((count) => [count, { ...columned[count], display: "grid" }]),
  ) as Record<Count, SystemStyleObject>;
}

/**
 * Returns the inline padding of a band across the frame, so its text starts on the rows' text
 * line.
 *
 * @remarks
 *   The field and the select-all row render in the frame, outside the list, and span the frame's
 *   width. Each inset is the list's padding plus the row's own inset.
 * @param start - The row's start inset.
 * @param end - The row's end inset.
 * @returns The start and end padding.
 */
export function banded(start: string, end: string): SystemStyleObject {
  return {
    paddingInlineEnd: `calc(${PAD} + ${end})`,
    paddingInlineStart: `calc(${PAD} + ${start})`,
  };
}

/**
 * Returns the start padding of a part outside the frame, so its text starts on the rows' text
 * line.
 *
 * @remarks
 *   The label above the frame and the summary below it take the list's padding plus the row's
 *   start inset.
 * @param start - The row's start inset.
 * @returns The start padding.
 */
export function aligned(start: string): SystemStyleObject {
  return { paddingInlineStart: `calc(${PAD} + ${start})` };
}

/**
 * Returns the height of a one-line row at a size, as the value of `ROW_HEIGHT`.
 *
 * @remarks
 *   A window and a transfer read the height before any row renders. The height is the row's floor
 *   plus its block padding, the two values the row itself reads. A row with a description is taller
 *   than this value.
 * @param size - The list's size.
 * @returns The custom property and its value.
 */
export function rowHeight(size: Scale): SystemStyleObject {
  const floor = "{sizes.6}";
  const padding = dense(`{spacing.gap.${below(size)}}`);

  return { [ROW_HEIGHT]: `calc(${floor} + ${padding} + ${padding})` };
}
