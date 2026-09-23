/**
 * Measures the room a listbox keeps: where a row's words start, where a band beside the rows has
 * to start to land on the same line, how tall one row comes to, and where a mark stands on a row
 * that runs to more than one line.
 *
 * @remarks
 *   These are the arithmetic the recipe is written from rather than styles of their own. They sit
 *   beside it because the recipe is long enough without them, and because a second copy of any of
 *   this drifts from the first the moment a theme moves a step.
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
 * The room the list leaves round its rows.
 *
 * @remarks
 *   Every look leaves it, not the raised one alone, so a row sits the same distance from the
 *   list's edge whatever the list is drawn on. A row is a shape a highlight is drawn round, and a
 *   shape flush with its container has nowhere to draw one.
 */
export const PAD = "{spacing.gap.xs}";

/**
 * The property the list publishes one row's height in, for whatever counts rows into a measure.
 */
export const ROW_HEIGHT = "--listbox-row";

/**
 * Writes one entry per count of columns: the template the count draws, and the display a grid
 * needs beside it, because the list is a flex column until a caller asks for tiles.
 */
export function tiled(): Record<Count, SystemStyleObject> {
  const columned = columnCounts();

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the entries are built from the counts, one per count
  return Object.fromEntries(
    COUNTS.map((count) => [count, { ...columned[count], display: "grid" }]),
  ) as Record<Count, SystemStyleObject>;
}

/**
 * Writes the insets a band across the list takes, so its words land on the line the rows' words
 * are on.
 *
 * @remarks
 *   A field or a select-all row is a band rather than a row within the list. It is drawn in the
 *   frame beside the list rather than inside it, so it reaches both edges of the box on its own
 *   and the rule under it runs the whole way across.
 *   Its words sit where a row's words sit, which is the room the list leaves round its rows plus
 *   the room the row itself leaves before its words. The band states both, because the list's room
 *   is padding on the list and a band is not inside it.
 */
export function banded(start: string, end: string): SystemStyleObject {
  return {
    paddingInlineEnd: `calc(${PAD} + ${end})`,
    paddingInlineStart: `calc(${PAD} + ${start})`,
  };
}

/**
 * Writes the inset a part outside the list takes, so its words start on the line the rows' words
 * start on.
 *
 * @remarks
 *   The label above the list and the summary below it stand outside the box the rows sit in. Drawn
 *   flush with that box they begin a step to the left of every row, which reads as two columns of
 *   text rather than one. The inset is the room the list leaves round its rows plus the room a row
 *   leaves before its own words, which is what a row's first letter sits behind.
 */
export function aligned(start: string): SystemStyleObject {
  return { paddingInlineStart: `calc(${PAD} + ${start})` };
}

/**
 * Writes a square mark standing on the first line of a row rather than in the middle of the row.
 *
 * @remarks
 *   A row carrying a line of explanation is two lines tall, and a mark centred against the whole
 *   of it floats between the two, belonging to neither. Measured on the transfer's rows: the row's
 *   middle and the box's middle both at 1490.27, with the name's middle at 1480.8.
 *   The row aligns its parts to its start and the mark takes half the difference between one line
 *   and itself as room above it, which puts it on the first line whether the row runs to one line
 *   or two. The mark states the leading the lines are set in, because `lh` reads the leading of
 *   whatever element it is written on and the lines carry their own.
 */
export function firstLine(square: string): SystemStyleObject {
  return { blockSize: square, inlineSize: square, marginBlockStart: `calc((1lh - ${square}) / 2)` };
}

/**
 * Writes the height one row of a given size comes to, as a property the list publishes.
 *
 * @remarks
 *   A transfer holds two lists to one height and a window turns a scroll position into a row, and
 *   both need to know how tall a row is before a row is drawn. The height is written from the same
 *   two values the row itself is written from, so a theme that moves either moves both, and it is
 *   published rather than duplicated because a second copy of the arithmetic drifts from the first.
 *   It holds for a list of single-line rows. A row carrying a line of explanation is taller than
 *   this says, and a measure counted off it comes out short.
 */
export function rowHeight(size: Scale): SystemStyleObject {
  const floor = "{sizes.6}";
  const padding = dense(`{spacing.gap.${below(size)}}`);

  return { [ROW_HEIGHT]: `calc(${floor} + ${padding} + ${padding})` };
}
