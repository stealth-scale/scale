/**
 * Draws a component once per value of an axis, or once per pair where a second axis crosses the
 * first, each cell captioned with the value it was drawn for.
 *
 * @remarks
 *   A specimen showing a component at three sizes, or in every look, is the same shape every time:
 *   a caption, the thing, repeat. This is that shape, so a specimen holds only what it shows. One
 *   axis is a row of captioned cells that wraps where it runs out of room, or a column of them,
 *   both the library's stack. Two axes crossed are the matrix recipe's grid: the second axis
 *   captioned once along the top, the first captioned once down the side, and one cell per pair
 *   between them, so neither caption repeats. Every cell also carries the caption the top edge
 *   holds, which the recipe shows only once the grid has folded. The count across is read off the
 *   axis and handed to the recipe, which offers one value per count.
 *   Each cell is a sample, so how it is drawn and where the drawing sits in it are the sample's
 *   axes and a matrix states them once for every cell it draws. A board states the same two, so a
 *   page that crosses an axis and a page laid out by hand read alike. A cell of the crossed grid
 *   states no value of its own, because the edges of the grid caption it already.
 */

import { type ReactElement, type ReactNode } from "react";

import { Board, type BoardProps } from "#board/board.tsx";
import { Caption } from "#caption.tsx";
import { bare } from "#framed/bare.ts";
import { ABSENT, type Axis, captionOf, nameOf } from "#matrix/axis.ts";
import { useFramedCell } from "#matrix/framed.ts";
import { Cell, Grid, Head, Label, Root, type RootProps, Row, Side } from "#matrix/parts.ts";
import { type Display, DisplayProvider } from "#sample/display.ts";
import { Sample } from "#sample/sample.tsx";

/**
 * The counts of values across the recipe offers.
 */
type Across = NonNullable<RootProps["across"]>;

/**
 * The columns a matrix running down the page draws: one, so each value takes a row of its own.
 */
const ONE = "1";

/**
 * Describes what a matrix takes.
 *
 * @typeParam Value - What one cell is drawn for along the first axis.
 * @typeParam Other - What one cell is drawn for along the second, where a second axis crosses.
 */
export interface MatrixProps<Value, Other = undefined> extends Axis<Value>, Display {
  /**
   * A second axis, whose values run across each row while the first runs down the rows.
   */
  across?: Axis<Other> | undefined;

  /**
   * Draws one cell, for a value of the axis and, where a second axis crosses, a value of that.
   */
  children: (value: Value, across: Other) => ReactNode;

  /**
   * The columns the cells of one axis are laid on, which is the board's own axis. Read only where
   * no second axis crosses, because a crossed grid draws one column per value across.
   */
  columns?: BoardProps["columns"];

  /**
   * Which way the cells of one axis run. Across by default, on as many columns of the smallest
   * measure as the room holds. A column is one cell per row, which is `columns` at one.
   */
  direction?: "column" | "row";
}

/**
 * Spells the count of values across as the recipe names it.
 *
 * @remarks
 *   The recipe offers one value per count, so the count is the value's own name. A count past
 *   what the recipe offers is a specimen crossing more values than a page can read across, which
 *   the type of the root's prop reports.
 */
function counted(values: readonly unknown[]): Across {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the recipe names each count it offers by its digits
  return String(values.length) as Across;
}

/**
 * Draws one captioned cell of a single axis.
 */
function itemed<Value>(axis: Axis<Value>, value: Value, drawn: ReactNode): ReactElement {
  return (
    <Sample key={captionOf(axis, value)} knob={axis.knob} of={nameOf(axis, value)}>
      {drawn}
    </Sample>
  );
}

/**
 * Draws the top edge of the grid: an empty corner, then the second axis captioned once per column.
 */
function headed<Other>(across: Axis<Other>): ReactElement {
  return (
    <Head>
      <Cell />
      {across.of.map((other) => (
        <Cell key={captionOf(across, other)}>
          <Caption knob={across.knob}>{nameOf(across, other)}</Caption>
        </Cell>
      ))}
    </Head>
  );
}

/**
 * Draws one row of the grid: the first axis captioned once at the side, then one cell per value
 * of the second, each carrying the caption it shows while the grid is folded.
 */
function rowed<Value, Other>(
  axis: Axis<Value>,
  across: Axis<Other>,
  value: Value,
  drawn: (value: Value, across: Other) => ReactNode,
): ReactElement {
  return (
    <Row key={captionOf(axis, value)}>
      <Side>
        <Caption knob={axis.knob}>{nameOf(axis, value)}</Caption>
      </Side>
      {across.of.map((other) => (
        <Cell key={captionOf(across, other)}>
          <Label>
            <Caption knob={across.knob}>{nameOf(across, other)}</Caption>
          </Label>
          <Sample>{drawn(value, other)}</Sample>
        </Cell>
      ))}
    </Row>
  );
}

/**
 * Draws one captioned cell per value of an axis, or one per pair where a second axis crosses it.
 *
 * @remarks
 *   In a framed document the matrix draws the one cell the frame was asked for and nothing round
 *   it, and tells the page holding the frame which cells it offers, so the page draws a picker
 *   per axis over the frame and a reader sees each cell as a window of a device's size shows it
 *   rather than the grid squeezed into one.
 * @param props - The axes, how each cell is drawn, and what to draw for each value.
 * @returns The cells, captioned and spaced.
 */
export function Matrix<Value, Other = undefined>(props: MatrixProps<Value, Other>): ReactElement {
  const { across, children, columns, direction = "row", place, variant, ...axis } = props;
  const display: Display = { place, variant };
  const cell = useFramedCell(axis, across, children);

  if (cell !== undefined) return bare(cell);

  if (across !== undefined) {
    return (
      <Root across={counted(across.of)}>
        <DisplayProvider value={display}>
          <Grid>
            {headed(across)}
            {axis.of.map((value) => rowed(axis, across, value, children))}
          </Grid>
        </DisplayProvider>
      </Root>
    );
  }

  const laid = columns ?? (direction === "column" ? ONE : undefined);

  return (
    <Root>
      <Board {...display} {...(laid === undefined ? {} : { columns: laid })}>
        {axis.of.map((value) => itemed(axis, value, children(value, ABSENT)))}
      </Board>
    </Root>
  );
}
