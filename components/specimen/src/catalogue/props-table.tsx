/**
 * Renders the props table of one part: the name, the accepted type, the default and the summary of
 * each prop.
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
 * Column widths shared by every props table on a page.
 *
 * @remarks
 *   Fixed widths align the columns of consecutive tables. The summary column is widest, because it
 *   wraps to the most lines. The type column is second, because a union wraps at each bar.
 */
const WIDTHS = { accepts: "26%", fallback: "10%", name: "20%", says: "44%" };

/**
 * Column widths when no prop has a default, without the default column.
 */
const NARROWED = { accepts: "28%", name: "22%", says: "50%" };

/**
 * Negative inline margin that aligns a prop name rendered as `Code` with its column heading.
 *
 * @remarks
 *   `Code` pads its fill by one inset, so its text starts one inset further in than plain text. The
 *   value repeats the way `Code` writes its padding, including the density multiplier.
 */
const PULL = "calc(token(spacing.inset.xs) * var(--density, 1) * -1)";

/**
 * Describes the props of PropsTable.
 */
export interface PropsTableProps {
  /**
   * Accessible name of the table, the name of the part.
   */
  readonly label: string;

  /**
   * Props to render, one per row.
   */
  readonly rows: readonly Row[];
}

/**
 * Renders a prop's name, with an `axis` badge in a table of mixed kinds and a `required` badge on
 * a required prop.
 *
 * @remarks
 *   The `axis` badge renders only when the table holds variant and non-variant props, because in a
 *   table of axes only it would mark every row.
 */
function named(row: Row, mixed: boolean): ReactElement {
  const { kind, name, required } = row.prop;

  return (
    <Group gap="xs" marginInlineStart={PULL}>
      <Code size="sm">{name}</Code>
      {mixed && kind === "variant" ? (
        <Badge palette="info" size="sm">
          {"axis"}
        </Badge>
      ) : null}
      {required ? (
        <Badge palette="error" size="sm">
          {"required"}
        </Badge>
      ) : null}
    </Group>
  );
}

/**
 * Renders the type a prop accepts.
 */
function accepts(row: Row): ReactElement {
  return <PropsType accepts={row.prop.accepts} shows={row.shows} />;
}

/**
 * Renders the default value of a prop, or nothing when the declaration has none.
 */
function fallback(row: Row): null | ReactElement {
  return row.prop.fallback === "" ? null : <Code size="sm">{row.prop.fallback}</Code>;
}

/**
 * Renders the first sentence of a prop's doc comment.
 */
function says(row: Row): ReactElement {
  return <Text size="sm">{row.prop.says}</Text>;
}

/**
 * Renders one row per prop of a part.
 *
 * @remarks
 *   One table covers every prop of a part, so a prop is found by name in one place, and the `axis`
 *   badge marks the kind. The type column wraps, so a long union shows every member. A prop without
 *   a doc comment has an empty summary cell. The table is named with `aria-label` and has no
 *   caption, because the part's heading is directly above it. Every table renders in the surface
 *   variant, so consecutive tables have separate edges and shadows.
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
