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
 *   holds, which the recipe shows only once the grid has folded. A cell is plain flow rather than
 *   a flex column, so what is drawn in it keeps its own nature: a button or a badge is inline and
 *   takes its own width, and a stack, a card or a field is a block and fills the cell. The count
 *   across is read off the axis and handed to the recipe, which offers one value per count.
 */

import { type ReactElement, type ReactNode } from "react";

import { Stack } from "@stealthscale/component-layout";

import { type Axis, captionOf, nameOf } from "#matrix/axis.ts";
import { Caption } from "#matrix/caption.tsx";
import { Cell, Grid, Head, Item, Label, Root, type RootProps, Row, Side } from "#matrix/parts.ts";

/**
 * The counts of values across the recipe offers.
 */
type Across = NonNullable<RootProps["across"]>;

/**
 * Describes what a matrix takes.
 *
 * @typeParam Value - What one cell is drawn for along the first axis.
 * @typeParam Other - What one cell is drawn for along the second, where a second axis crosses.
 */
export interface MatrixProps<Value, Other = undefined> extends Axis<Value> {
  /**
   * A second axis, whose values run across each row while the first runs down the rows.
   */
  across?: Axis<Other> | undefined;

  /**
   * Draws one cell, for a value of the axis and, where a second axis crosses, a value of that.
   */
  children: (value: Value, across: Other) => ReactNode;

  /**
   * Which way the cells of one axis run. Across by default, wrapping where the row runs out of
   * room.
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
    <Item key={captionOf(axis, value)}>
      <Caption knob={axis.knob}>{nameOf(axis, value)}</Caption>
      {drawn}
    </Item>
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
          {drawn(value, other)}
        </Cell>
      ))}
    </Row>
  );
}

/**
 * Draws one captioned cell per value of an axis, or one per pair where a second axis crosses it.
 *
 * @param props - The axes and what to draw for each value.
 * @returns The cells, captioned and spaced.
 */
export function Matrix<Value, Other = undefined>(props: MatrixProps<Value, Other>): ReactElement {
  const { across, children, direction = "row", ...axis } = props;

  if (across !== undefined) {
    return (
      <Root across={counted(across.of)}>
        <Grid>
          {headed(across)}
          {axis.of.map((value) => rowed(axis, across, value, children))}
        </Grid>
      </Root>
    );
  }

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the second argument stands for the absent axis, which the type states as undefined
  const alone = undefined as Other;
  const items = axis.of.map((value) => itemed(axis, value, children(value, alone)));

  return (
    <Root>
      {direction === "row" ? (
        <Stack align="flex-start" direction="row" gap="2xl" wrap>
          {items}
        </Stack>
      ) : (
        <Stack gap="2xl">{items}</Stack>
      )}
    </Root>
  );
}
