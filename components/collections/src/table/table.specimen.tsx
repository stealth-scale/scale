/**
 * Shows the table: every look at every size, every alignment, both layouts, every corner, the
 * rows striped, ruled and responding, and a wide table with its header and first column held.
 *
 * @remarks
 *   Every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. Every table holds the same three invoices. The words are keys under
 *   `table` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/table.json`.
 */

import { type ReactElement, useId } from "react";

import { Matrix, type Scene, specimen, useWords, valuesOf } from "@stealthscale/specimen";

import * as Table from "#table/index.ts";
import { recipe } from "#table/recipe.ts";

/**
 * The ways the rows can be drawn beside the rows as they are.
 */
const ROWS = ["default", "striped", "ruled", "interactive"] as const;

/**
 * The invoices every table holds: the client's key, the total, and when it is due.
 */
const INVOICES = [
  ["fathom", "1,024.00", "2 October"],
  ["lantern", "380.50", "9 October"],
  ["pebble", "2,110.00", "16 October"],
] as const;

/**
 * Describes what the invoices take beyond the table's variants.
 */
interface InvoicesProps {
  /**
   * How many columns of figures follow the total, for a table wide enough to scroll.
   */
  readonly wide?: boolean;
}

/**
 * Draws the invoices as a captioned table, with more columns where asked.
 */
function Invoices({ wide = false, ...rest }: InvoicesProps & Table.ScrollerProps): ReactElement {
  const { t } = useWords("table");
  const id = useId();
  const months = wide ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"] : [];

  return (
    <Table.Scroller aria-labelledby={id} {...rest}>
      <Table.Root>
        <Table.Caption id={id}>{t("caption")}</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t("client")}</Table.ColumnHeader>
            <Table.ColumnHeader data-numeric>
              <Table.Sorter aria-label={t("sortTotal")}>{t("total")}</Table.Sorter>
            </Table.ColumnHeader>
            <Table.ColumnHeader>{t("due")}</Table.ColumnHeader>
            {months.map((month) => (
              <Table.ColumnHeader data-numeric key={month}>
                {month}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {INVOICES.map(([client, total, due]) => (
            <Table.Row key={client}>
              <Table.RowHeader>{t(client)}</Table.RowHeader>
              <Table.Cell data-numeric>{total}</Table.Cell>
              <Table.Cell>{due}</Table.Cell>
              {months.map((month) => (
                <Table.Cell data-numeric key={month}>
                  {total}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.Scroller>
  );
}

/**
 * Draws the invoices in every look at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => <Invoices size={size} variant={variant} />}
    </Matrix>
  );
}

/**
 * Draws the invoices with their figures at every place in the row.
 */
function Alignment(): ReactElement {
  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => <Invoices align={align} />}
    </Matrix>
  );
}

/**
 * Draws the invoices in both layouts.
 */
function Layouts(): ReactElement {
  return (
    <Matrix direction="column" knob="layout" of={valuesOf(recipe, "layout")}>
      {(layout) => <Invoices layout={layout} />}
    </Matrix>
  );
}

/**
 * Draws the outlined box at every corner.
 */
function Corners(): ReactElement {
  return (
    <Matrix knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => <Invoices radius={radius} variant="outline" />}
    </Matrix>
  );
}

/**
 * Draws the rows each way they can be drawn.
 */
function Rows(): ReactElement {
  return (
    <Matrix knob="rows" of={ROWS}>
      {(rows) => (
        <Invoices
          interactive={rows === "interactive"}
          ruled={rows === "ruled"}
          striped={rows === "striped"}
        />
      )}
    </Matrix>
  );
}

/**
 * Draws a wide table with its header and first column held in view.
 */
function Sticky(): ReactElement {
  return (
    <Matrix direction="column" knob="sticky" of={["header and column"]}>
      {() => <Invoices stickyColumn stickyHeader variant="outline" wide />}
    </Matrix>
  );
}

/**
 * Every look at every size.
 */
export const looks: Scene = {
  about: "table.looks.about",
  draw: Looks,
  title: "table.looks.title",
};

/**
 * Every alignment.
 */
export const alignment: Scene = {
  about: "table.alignment.about",
  draw: Alignment,
  title: "table.alignment.title",
};

/**
 * Both layouts.
 */
export const layouts: Scene = {
  about: "table.layouts.about",
  draw: Layouts,
  title: "table.layouts.title",
};

/**
 * Every corner.
 */
export const corners: Scene = {
  about: "table.corners.about",
  draw: Corners,
  title: "table.corners.title",
};

/**
 * The rows each way.
 */
export const rows: Scene = { about: "table.rows.about", draw: Rows, title: "table.rows.title" };

/**
 * The header and the first column held.
 */
export const sticky: Scene = {
  about: "table.sticky.about",
  draw: Sticky,
  title: "table.sticky.title",
};

export default specimen({
  about: "table.about",
  group: "Collections",
  id: "collections/table",
  scenes: [looks, alignment, layouts, corners, rows, sticky],
  title: "table.title",
});
