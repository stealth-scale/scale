/**
 * Binds the collections table's parts, the actions button that clears a filter or resets the
 * columns, the disclosure popover's panel and the forms checkbox of a value filter with the data
 * table recipe's slots, and the spans several parts render.
 *
 * @remarks
 *   Each part renders the other package's element with that package's classes, and adds the data
 *   table's slot class, whose rules place a pinned column's cells, a column's width, a sized
 *   table's width and its scroller's, a windowed table's pinned rows, a filter panel's width, a
 *   value's count at its row's end and a reset button at its panel's end. The constants state the
 *   other packages' props types, because the bound parts' own types name a type those packages do
 *   not export.
 */

import { type JSX } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";
import { Table } from "@stealthscale/component-collections";
import { Popover } from "@stealthscale/component-disclosure";
import { Checkbox } from "@stealthscale/component-forms";

import { withContext } from "#data-table/context.ts";

/**
 * Renders the `span` around a count, such as a value's rows or a group's records, in the muted
 * ink with tabular figures.
 */
export const Count = withContext("span", "count");

/**
 * Renders the `span` around the caller's glyph in a toggle that opens a row, which turns a quarter
 * while the row is open.
 */
export const ExpandIndicator = withContext("span", "expandIndicator");

/**
 * Renders the `span` around a button in a body cell, as wide as an `xs` button, whose negative
 * block margin keeps the row as tall as a row of text.
 */
export const Toggle = withContext("span", "toggle");

/**
 * Renders the `span` around a checkbox of the select column, one line tall with the checkbox
 * centred in it, so its row is as tall as a row of text.
 */
export const SelectBox = withContext("span", "selectBox");

/**
 * Renders the `span` around a cell's content under its open editor, hidden, so the cell keeps its
 * size.
 */
export const Covered = withContext("span", "covered");

/**
 * Renders the `span` over a cell that contains its open editor, which the control fills.
 */
export const Editor = withContext("span", "editor");

/**
 * Renders the `span` under a cell with the reason its editor's value was refused.
 */
export const EditorError = withContext("span", "editorError");

/**
 * Renders the actions `Button` that clears a filter or resets the columns, at its panel's end.
 */
export const Reset: (props: ButtonProps) => JSX.Element = withContext(Button, "reset");

/**
 * Renders the disclosure popover's panel of a column's filter, `sizes.60` wide.
 */
export const Panel: (props: Popover.ContentProps) => JSX.Element = withContext(
  Popover.Content,
  "panel",
);

/**
 * Renders a value filter's box as wide as its panel, so the counts share a column at its end.
 */
export const Value: (props: Checkbox.RootProps) => JSX.Element = withContext(
  Checkbox.Root,
  "value",
);

/**
 * Renders a value filter's label, which puts the value's count at the row's end.
 */
export const ValueLabel: (props: Checkbox.LabelProps) => JSX.Element = withContext(
  Checkbox.Label,
  "valueLabel",
);

/**
 * Renders a data cell, a `td`.
 */
export const Cell: (props: Table.CellProps) => JSX.Element = withContext(Table.Cell, "cell");

/**
 * Renders a column's header, a `th` with `scope="col"`.
 */
export const ColumnHeader: (props: Table.ColumnHeaderProps) => JSX.Element = withContext(
  Table.ColumnHeader,
  "columnHeader",
);

/**
 * Renders a row header, a `th` with `scope="row"`.
 */
export const RowHeader: (props: Table.RowHeaderProps) => JSX.Element = withContext(
  Table.RowHeader,
  "rowHeader",
);

/**
 * Renders a body row, a `tr`, whose rule the recipe widens where the row ends a region.
 */
export const Row: (props: Table.RowProps) => JSX.Element = withContext(Table.Row, "row");

/**
 * Renders a windowed table's spacer row, a `tr` as tall as `--spacer-size`.
 */
export const Spacer = withContext("tr", "spacer");

/**
 * Renders a windowed table's group of pinned rows, a `tbody` the recipe sticks to its edge of the
 * viewport.
 */
export const Region: (props: Table.BodyProps) => JSX.Element = withContext(Table.Body, "region");

/**
 * Renders a column's declaration, a `col`, whose width the recipe reads from `--column-size`.
 */
export const Column: (props: Table.ColumnProps) => JSX.Element = withContext(
  Table.Column,
  "column",
);

/**
 * Renders the `table`, as wide as `--table-size` while it states `data-sized`.
 */
export const Sheet: (props: Table.RootProps) => JSX.Element = withContext(Table.Root, "table");

/**
 * Describes the props of the collections table's scroller, which the frame takes.
 */
export type ScrollerProps = Table.ScrollerProps;

/**
 * Renders the scroller around the table, as wide as a sized table and never wider than its room
 * while it states `data-sized`.
 */
export const Frame: (props: ScrollerProps) => JSX.Element = withContext(Table.Scroller, "frame");
