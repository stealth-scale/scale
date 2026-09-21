/**
 * Shows the table: both looks at every size, every alignment, both layouts, every corner, the rules
 * it is drawn with, the rows striped and responding, names that span columns, names that span rows,
 * and the three ways names are held in view while a table scrolls.
 *
 * @remarks
 *   Every scene draws `Table.Simple` from one list of columns, which is what a caller reaches for,
 *   and every axis is read off the recipe, so a value added to the theme reaches the page without
 *   this file changing. The two scenes that span names compose the parts instead, because a name
 *   spanning rows is the shape a list of columns does not describe.
 *   Every table holds the same three accounts and closes on a total, because a table of figures
 *   with nothing summing them is half a table.
 *   The words are keys under `table` in the catalogue's namespace, kept beside this file in
 *   `locales/en/specimen/table.json`.
 */

import { type ReactElement, type ReactNode, useId } from "react";

import {
  Board,
  Matrix,
  Room,
  Sample,
  type Scene,
  specimen,
  useWords,
  valuesOf,
} from "@stealthscale/specimen";

import * as Table from "#table/index.ts";
import { recipe } from "#table/recipe.ts";

/**
 * The ways the rows can be drawn beside the rows as they are.
 */
const ROWS = ["default", "striped", "interactive"] as const;

/**
 * Describes one account a table draws.
 */
interface Account {
  /**
   * The amount the account came to.
   */
  readonly amount: string;

  /**
   * The key the account's name and its note are read under.
   */
  readonly key: string;

  /**
   * The account's name, in the reader's language.
   */
  readonly name: string;

  /**
   * What the account says under its name.
   */
  readonly note: string;

  /**
   * The state the account is in, in the reader's language.
   */
  readonly state: string;
}

/**
 * The accounts every table holds: the key, the state it is in, and what it comes to.
 */
const ACCOUNTS = [
  ["bridge", "settled", "4,120.00"],
  ["halden", "held", "880.40"],
  ["perrin", "queued", "12,500.00"],
] as const;

/**
 * What the accounts come to, which the footer states.
 */
const TOTAL = "17,500.40";

/**
 * The months a wide table runs across, three to a quarter.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

/**
 * Reads the accounts in the reader's language.
 */
function useAccounts(): readonly Account[] {
  const { t } = useWords("table");

  return ACCOUNTS.map(([key, state, amount]) => ({
    amount,
    key,
    name: t(key),
    note: t(`${key}Note`),
    state: t(state),
  }));
}

/**
 * Reads what the last row holds under one column: the word `Total` under the names, the sum under
 * the figures, and nothing under the rest.
 */
function summed(column: Table.Leaf<Account>, label: string): ReactNode {
  if (column.key === "name") return label;

  return column.key === "amount" ? TOTAL : null;
}

/**
 * Describes what a scene asks the shared table to draw beyond its variants.
 */
interface PayoutsProps {
  /**
   * Whether the state each account is in is left out, for a scene comparing looks in a narrow cell.
   */
  readonly brief?: boolean | undefined;

  /**
   * Whether the note each account carries stands in place of its state, for a scene whose rows run
   * to more than one line.
   */
  readonly noted?: boolean | undefined;
}

/**
 * Draws the accounts as a captioned table closing on a total.
 *
 * @param props - What the table shows beyond its figures, and everything the scroller takes.
 * @returns The table.
 */
function Payouts({
  brief = false,
  noted = false,
  ...rest
}: Omit<Table.SimpleProps<Account>, "columns" | "rows" | "rowToKey"> & PayoutsProps): ReactElement {
  const { t } = useWords("table");
  const rows = useAccounts();

  const middle: Table.Leaf<Account> = noted
    ? { key: "note", label: t("note") }
    : { key: "state", label: t("state") };

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        { key: "name", label: t("account"), rowHeader: true },
        ...(brief ? [] : [middle]),
        {
          key: "amount",
          label: t("amount"),
          numeric: true,
          sorted: "descending",
          sortLabel: t("sortAmount"),
        },
      ]}
      rows={rows}
      rowToKey={(row) => row.key}
      total={(column) => summed(column, t("totals"))}
      {...rest}
    />
  );
}

/**
 * Draws the accounts in both looks at every size.
 */
function Looks(): ReactElement {
  return (
    <Matrix
      across={{ knob: "size", of: valuesOf(recipe, "size") }}
      direction="column"
      knob="variant"
      of={valuesOf(recipe, "variant")}
    >
      {(variant, size) => <Payouts size={size} variant={variant} />}
    </Matrix>
  );
}

/**
 * Draws the accounts with a note that wraps, so the alignment tells itself apart.
 */
function Alignment(): ReactElement {
  return (
    <Matrix knob="align" of={valuesOf(recipe, "align")}>
      {(align) => (
        <Room size="sm">
          <Payouts align={align} noted variant="surface" />
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Draws the accounts in both layouts, the fixed one stating its widths.
 *
 * @remarks
 *   A fixed layout sizes the columns from the first row and the column declarations alone, so it
 *   reads none of the rows below. A width on a column is where that is stated, which is once for
 *   the table rather than once on the first cell of every row.
 */
function Layouts(): ReactElement {
  const { t } = useWords("table");
  const rows = useAccounts();

  return (
    <Matrix direction="column" knob="layout" of={valuesOf(recipe, "layout")}>
      {(layout) => (
        <Room size="sm">
          {layout === "auto" ? (
            <Payouts layout={layout} variant="surface" />
          ) : (
            <Table.Simple<Account>
              caption={t("caption")}
              columns={[
                { key: "name", label: t("account"), rowHeader: true, width: "40%" },
                { key: "state", label: t("state"), width: "35%" },
                { key: "amount", label: t("amount"), numeric: true, width: "25%" },
              ]}
              layout={layout}
              rows={rows}
              rowToKey={(row) => row.key}
              total={(column) => summed(column, t("totals"))}
              variant="surface"
            />
          )}
        </Room>
      )}
    </Matrix>
  );
}

/**
 * Draws the surface at every corner.
 */
function Corners(): ReactElement {
  return (
    <Matrix knob="radius" of={valuesOf(recipe, "radius")}>
      {(radius) => <Payouts brief radius={radius} variant="surface" />}
    </Matrix>
  );
}

/**
 * Draws the table with every set of rules it offers.
 */
function Ruled(): ReactElement {
  return (
    <Matrix knob="rules" of={valuesOf(recipe, "rules")}>
      {(rules) => <Payouts brief rules={rules} variant="surface" />}
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
        <Payouts
          brief
          interactive={rows === "interactive"}
          striped={rows === "striped"}
          variant="surface"
        />
      )}
    </Matrix>
  );
}

/**
 * Draws a name spanning the three columns of its quarter, over a row naming each month.
 *
 * @remarks
 *   A column holding columns spans them. The span, the second row of names and the `colgroup` scope
 *   are worked out from the shape rather than written, because a `col` scope on a spanning name
 *   says the cells directly under it answer to the name, which is the row of months rather than the
 *   figures.
 */
function Quarters(): ReactElement {
  const { t } = useWords("table");
  const rows = useAccounts();

  return (
    <Table.Simple<Account>
      caption={t("caption")}
      columns={[
        { key: "name", label: t("account"), rowHeader: true },
        ...[0, 1, 2].map((at) => ({
          columns: MONTHS.slice(at * 3, at * 3 + 3).map((month) => ({
            cell: (row: Account) => row.amount,
            key: month,
            label: month,
            numeric: true,
          })),
          label: `Q${String(at + 1)}`,
        })),
      ]}
      rows={rows}
      rowToKey={(row) => row.key}
      rules="all"
      variant="surface"
    />
  );
}

/**
 * Draws a name spanning the rows under it, for a table of several runs per account.
 *
 * @remarks
 *   Composed from the parts rather than drawn from a list of columns. A name spanning rows belongs
 *   to a group of records rather than to a column, and each group is a `tbody` of its own, because
 *   a row that spans out of its section is a row a browser is free to redraw anywhere.
 */
function Runs(): ReactElement {
  const { t } = useWords("table");
  const rows = useAccounts();
  const id = useId();
  const months = MONTHS.slice(0, 2);

  return (
    <Table.Scroller aria-labelledby={id} variant="surface">
      <Table.Root>
        <Table.Caption id={id}>{t("caption")}</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t("account")}</Table.ColumnHeader>
            <Table.ColumnHeader>{t("month")}</Table.ColumnHeader>
            <Table.ColumnHeader data-numeric>{t("amount")}</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        {rows.map((row) => (
          <Table.Body key={row.key}>
            {months.map((month, at) => (
              <Table.Row key={month}>
                {at === 0 ? (
                  <Table.RowHeader rowSpan={months.length} scope="rowgroup">
                    {row.name}
                  </Table.RowHeader>
                ) : null}
                <Table.Cell>{month}</Table.Cell>
                <Table.Cell data-numeric>{row.amount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        ))}
      </Table.Root>
    </Table.Scroller>
  );
}

/**
 * Draws the accounts gathered into a section per state, and a table holding nothing at all.
 *
 * @remarks
 *   A section per heading rather than a heading row inside one. A group of rows is a group of rows
 *   to a screen reader as well as on the screen, and the heading states `rowgroup` as its scope so
 *   the rows under it answer to it.
 */
function Gathered(): ReactElement {
  const { t } = useWords("table");
  const rows = useAccounts();

  return (
    <Board place="start">
      <Sample of={t("gathered.of")}>
        <Table.Simple<Account>
          caption={t("caption")}
          columns={[
            { key: "name", label: t("account"), rowHeader: true },
            { key: "amount", label: t("amount"), numeric: true },
          ]}
          groupBy={(row) => row.state}
          rows={rows}
          rowToKey={(row) => row.key}
          variant="surface"
        />
      </Sample>
      <Sample of={t("gathered.none")}>
        <Table.Simple<Account>
          caption={t("caption")}
          columns={[
            { key: "name", label: t("account"), rowHeader: true },
            { key: "amount", label: t("amount"), numeric: true },
          ]}
          empty={t("nothing")}
          rows={[]}
          rowToKey={(row) => row.key}
          variant="surface"
        />
      </Sample>
    </Board>
  );
}

/**
 * How many weeks the held tables run to, which is more than any of their boxes shows.
 */
const WEEKS = Array.from({ length: 12 }, (_, at) => at + 1);

/**
 * Describes which way a held table is held.
 */
interface HeldProps {
  /**
   * Whether the week's own name stays put as the table scrolls sideways.
   */
  readonly stickyColumn?: boolean | undefined;

  /**
   * Whether the column names stay put as the table scrolls down.
   */
  readonly stickyHeader?: boolean | undefined;
}

/**
 * Draws a table longer and wider than its box, held whichever way a scene asks for.
 *
 * @remarks
 *   The box is held to a height and the table is laid out fixed. A header sticks within the box
 *   that scrolls, so the box needs a height before there is anything to stick to, and a column
 *   measured from its contents is a column that moves as the rows under it change.
 *   The table is named by `aria-label` rather than by a caption. A caption belongs to the table and
 *   scrolls with it, so one under a table longer than its box is a line nobody reads until they
 *   reach the last row.
 *   A table scrolls only on the axis the scene is about. The height is capped where the names are
 *   held and left alone where the first column is, because a scene about one axis that also scrolls
 *   on the other shows two things and settles neither.
 */
function Held({ stickyColumn = false, stickyHeader = false }: HeldProps): ReactElement {
  const { t } = useWords("table");
  const weeks = stickyHeader ? WEEKS : WEEKS.slice(0, 4);

  return (
    <Room size="sm">
      <Table.Simple
        aria-label={t("caption")}
        columns={[
          { key: "week", label: t("week"), rowHeader: true, width: "7rem" },
          ...MONTHS.map((month) => ({
            cell: () => TOTAL,
            key: month,
            label: month,
            numeric: true,
            width: "7rem",
          })),
        ]}
        layout="fixed"
        rows={weeks.map((week) => ({ week: t("weekAt", { at: String(week) }) }))}
        rowToKey={(row) => row.week}
        stickyColumn={stickyColumn}
        stickyHeader={stickyHeader}
        {...(stickyHeader ? { style: { maxBlockSize: "13rem" } } : {})}
        variant="surface"
      />
    </Room>
  );
}

/**
 * Draws the column names held while the table scrolls down.
 */
function StickyHeader(): ReactElement {
  return <Held stickyHeader />;
}

/**
 * Draws the week's own name held while the table scrolls sideways.
 */
function StickyColumn(): ReactElement {
  return <Held stickyColumn />;
}

/**
 * Draws both held, with the corner between them held in each direction.
 */
function StickyBoth(): ReactElement {
  return <Held stickyColumn stickyHeader />;
}

/**
 * Both looks at every size.
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
 * Every set of rules.
 */
export const ruled: Scene = {
  about: "table.ruled.about",
  draw: Ruled,
  title: "table.ruled.title",
};

/**
 * The rows each way.
 */
export const rows: Scene = { about: "table.rows.about", draw: Rows, title: "table.rows.title" };

/**
 * A name spanning the columns under it.
 */
export const quarters: Scene = {
  about: "table.quarters.about",
  draw: Quarters,
  title: "table.quarters.title",
};

/**
 * A name spanning the rows under it.
 */
export const runs: Scene = { about: "table.runs.about", draw: Runs, title: "table.runs.title" };

/**
 * Rows gathered into sections, and a table holding nothing.
 */
export const gathered: Scene = {
  about: "table.gathered.about",
  draw: Gathered,
  title: "table.gathered.title",
};

/**
 * The column names held while the table scrolls down.
 */
export const stickyHeader: Scene = {
  about: "table.stickyHeader.about",
  draw: StickyHeader,
  title: "table.stickyHeader.title",
};

/**
 * The first column held while the table scrolls sideways.
 */
export const stickyColumn: Scene = {
  about: "table.stickyColumn.about",
  draw: StickyColumn,
  title: "table.stickyColumn.title",
};

/**
 * Both held at once.
 */
export const stickyBoth: Scene = {
  about: "table.stickyBoth.about",
  draw: StickyBoth,
  title: "table.stickyBoth.title",
};

export default specimen({
  about: "table.about",
  group: "Collections",
  id: "collections/table",
  imports: 'import { Table } from "@stealthscale/component-collections";',
  scenes: [
    looks,
    alignment,
    layouts,
    corners,
    ruled,
    rows,
    quarters,
    runs,
    gathered,
    stickyHeader,
    stickyColumn,
    stickyBoth,
  ],
  title: "table.title",
});
