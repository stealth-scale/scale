/**
 * Draws one table of what a part accepts: the prop, the type, the fallback, and what it does.
 */

import { type ReactElement } from "react";

import { Table } from "@stealthscale/component-collections";
import { Badge } from "@stealthscale/component-data";
import { Group } from "@stealthscale/component-layout";
import { Code, Text } from "@stealthscale/component-typography";

import { type Row } from "#catalogue/parted.ts";
import { PropsType } from "#catalogue/props-type.tsx";
import { useWords } from "#words.ts";

/**
 * The widths the four columns are drawn at, which every table on the page shares.
 *
 * @remarks
 *   Stated rather than measured. A table that sizes its own columns lines up with nothing else on
 *   the page, so a reader comparing two parts reads two shapes.
 *   The sentence takes the most room. It is the column that runs to several lines, and every line
 *   it wraps to is a line the whole row grows by, so a narrow one left one row three lines tall
 *   beside another of one. The type is second: it runs long but wraps at every bar in a union.
 */
const WIDTHS = { accepts: "26%", fallback: "10%", name: "20%", says: "44%" };

/**
 * The widths the three columns are drawn at where no prop states a fallback, which is what the
 * fallback column would otherwise be: ten per cent of the row saying nothing.
 */
const NARROWED = { accepts: "28%", name: "22%", says: "50%" };

/**
 * Cancels the room a snippet holds its fill off its words by, so the name reads from the same line
 * its column name does.
 *
 * @remarks
 *   Every other column holds plain words, which start where the cell's own room ends. A name drawn
 *   as a filled snippet starts a step further in than that, and a column whose values are all a
 *   step right of its heading is the one thing a reader notices about a table of names.
 *   Written as the snippet writes it rather than as a plain token, because a snippet scales its own
 *   room by the density in force where it is drawn.
 */
const PULL = "calc(token(spacing.inset.xs) * var(--density, 1) * -1)";

/**
 * Describes what a table takes.
 */
export interface PropsTableProps {
  /**
   * Read out as the name of the table, which is the part it belongs to.
   */
  readonly label: string;

  /**
   * The props to draw, one per row.
   */
  readonly rows: readonly Row[];
}

/**
 * Draws a prop's name, marked where a caller has to pass it and, on a table holding both kinds,
 * where a theme moves it.
 *
 * @remarks
 *   The kind is marked only where the table holds both. A part whose props are every one of them an
 *   axis is the usual case, and a mark on every row of such a table is a column of marks that tells
 *   two rows apart from nothing.
 */
function named(row: Row, mixed: boolean): ReactElement {
  const { kind, name, required } = row.prop;

  return (
    <Group gap="xs" marginInlineStart={PULL}>
      <Code size="sm">{name}</Code>
      {mixed && kind === "variant" ? (
        <Badge size="sm" status="info">
          {"axis"}
        </Badge>
      ) : null}
      {required ? (
        <Badge size="sm" status="error">
          {"required"}
        </Badge>
      ) : null}
    </Group>
  );
}

/**
 * Draws the type a prop accepts, each named type in it opening on what it holds.
 */
function accepts(row: Row): ReactElement {
  return <PropsType accepts={row.prop.accepts} shows={row.shows} />;
}

/**
 * Draws the value a prop falls back to, or nothing where the declaration states none.
 */
function fallback(row: Row): null | ReactElement {
  return row.prop.fallback === "" ? null : <Code size="sm">{row.prop.fallback}</Code>;
}

/**
 * Draws the opening sentence of a prop's doc comment.
 */
function says(row: Row): ReactElement {
  return <Text size="sm">{row.prop.says}</Text>;
}

/**
 * Draws what a part accepts, one row per prop.
 *
 * @remarks
 *   One table for the whole part rather than one per kind. The axes a theme moves and the props a
 *   page sets are read by different people, but they are read in one list and looked up by name, so
 *   splitting them means searching two tables for a name that is in one of them. The kind is a mark
 *   on the row instead, which is what tells the two apart without breaking the list.
 *   The type wraps. A union of a dozen members is one line of a hundred characters, and a table
 *   that scrolled it sideways would hide the members past the edge of the card.
 *   A prop the declaration says nothing about is left blank rather than dashed. A column of dashes
 *   is a column a reader has to look past to find the sentences.
 *   The table is named rather than captioned. A caption is drawn under the table, and the part's
 *   own heading sits right above it, so a caption repeats at the far end what was just read.
 *   Every table is raised on a panel of its own. A band of a dozen parts is a dozen tables one
 *   under another, and drawn flat against the page they ran together into one grid with a heading
 *   dropped into it every few rows. The panel gives each one an edge and a shadow.
 * @param props - The name of the table and the props to draw.
 * @returns One row per prop, under a band of four column names.
 */
export function PropsTable({ label, rows }: PropsTableProps): ReactElement {
  const { t } = useWords();
  const kinds = new Set(rows.map((row) => row.prop.kind));
  const mixed = kinds.size > 1;
  const falls = rows.some((row) => row.prop.fallback !== "");
  const width = falls ? WIDTHS : NARROWED;

  return (
    <Table.Simple<Row>
      aria-label={label}
      banded
      columns={[
        {
          cell: (row) => named(row, mixed),
          key: "name",
          label: t("props.name"),
          rowHeader: true,
          width: width.name,
        },
        { cell: accepts, key: "accepts", label: t("props.accepts"), width: width.accepts },
        ...(falls
          ? [
              {
                cell: fallback,
                key: "fallback",
                label: t("props.fallback"),
                width: WIDTHS.fallback,
              },
            ]
          : []),
        { cell: says, key: "says", label: t("props.says"), width: width.says },
      ]}
      layout="fixed"
      rows={rows}
      rowToKey={(row) => row.prop.name}
      size="md"
      variant="surface"
    />
  );
}
