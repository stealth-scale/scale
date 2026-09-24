/**
 * Catalogue page for the table.
 *
 * @remarks
 *   `scenesOf` generates the sizes by looks, alignment, corners, rules, stripes, banded names,
 *   interactive rows and palettes, each from an example. The interactive and palette scenes stage a
 *   hover on the second row, and the held scenes stage a scroll position, so the behaviour shows in
 *   a still image. The layout scene is hand-written, because a fixed layout needs declared widths
 *   an auto layout does not. Sorting, spanning headers, row groups, sections, an empty table and
 *   the three held tables have hand-written scenes. Every scene renders a component from
 *   `examples/` and shows that file as its source. The words are keys under `table` in
 *   `locales/en/specimen/table.json`.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import {
  landmarked,
  Matrix,
  Room,
  type Scene,
  scenesOf,
  specimen,
  useWords,
} from "@stealthscale/specimen";

import * as examples from "#table/examples/index.ts";
import type * as Table from "#table/index.ts";
import { recipe } from "#table/recipe.ts";

/**
 * Props a generated scene passes to an example: the recipe's variants and the scroller's props.
 */
type Drawn = Omit<Table.ScrollerProps, "columns">;

/**
 * Layouts of the layout scene.
 */
const LAYOUTS: ReadonlyArray<NonNullable<Table.ScrollerProps["layout"]>> = ["auto", "fixed"];

/**
 * Describes what a staged scene sets after it mounts.
 */
interface StagedProps {
  /**
   * The table to stage.
   */
  readonly children: ReactNode;

  /**
   * Number of columns after the first to scroll under the first.
   */
  readonly columns?: number | undefined;

  /**
   * Whether the second body row takes `data-hover`, the attribute the hover condition reads.
   */
  readonly hover?: boolean | undefined;

  /**
   * Number of body rows to scroll under the header.
   */
  readonly rows?: number | undefined;
}

/**
 * Returns the distance from the end of one element to the start of another, on one axis.
 *
 * @remarks
 *   The staging scrolls by this distance, so a whole row or column meets the sticky edge and no
 *   part of one shows under it.
 */
function between(
  scroller: HTMLElement,
  from: string,
  to: string,
  axis: "block" | "inline",
): number {
  const start = scroller.querySelector(from)?.getBoundingClientRect();
  const end = scroller.querySelector(to)?.getBoundingClientRect();

  if (start === undefined || end === undefined) return 0;

  return axis === "block" ? end.top - start.bottom : end.left - start.right;
}

/**
 * Renders a table and sets a hover or a scroll position on it after it mounts.
 *
 * @remarks
 *   A still image shows no pointer and no scroll, so the scene sets the attribute or the position
 *   the page would. The staging never appears in an example.
 */
function Staged({ children, columns = 0, hover = false, rows = 0 }: StagedProps): ReactElement {
  const [box, setBox] = useState<HTMLDivElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const scroller = box?.querySelector<HTMLElement>(".table__scroller");
    const row = hover ? box?.querySelector<HTMLElement>("tbody > tr:nth-child(2)") : undefined;

    if (scroller === undefined || scroller === null) return undefined;

    scroller.scrollTo({
      left: between(scroller, "thead th", `thead th:nth-child(${String(columns + 2)})`, "inline"),
      top: between(scroller, "thead", `tbody > tr:nth-child(${String(rows + 1)})`, "block"),
    });
    if (row !== undefined && row !== null) row.dataset["hover"] = "";

    return () => {
      if (row !== undefined && row !== null) delete row.dataset["hover"];
    };
  }, [box, columns, hover, rows]);

  return <div ref={setBox}>{children}</div>;
}

/**
 * Describes the props of a held table: the sticky axes and how far to scroll.
 */
interface HeldProps {
  /**
   * Number of columns after the first to scroll under the first.
   */
  readonly columns?: number | undefined;

  /**
   * Number of body rows to scroll under the header.
   */
  readonly rows?: number | undefined;

  /**
   * Whether the first column sticks.
   */
  readonly stickyColumn?: boolean | undefined;

  /**
   * Whether the header rows stick.
   */
  readonly stickyHeader?: boolean | undefined;
}

/**
 * Renders the weeks table scrolled, named after its sticky axes so each region's name is unique.
 */
function Held({
  columns,
  rows,
  stickyColumn = false,
  stickyHeader = false,
}: HeldProps): ReactElement {
  const { t } = useWords("table");
  const sticky = { stickyColumn, stickyHeader };

  return (
    <Room size="sm">
      <Staged columns={columns} rows={rows}>
        <examples.weeks.Weeks aria-label={landmarked(t("caption"), sticky)} {...sticky} />
      </Staged>
    </Room>
  );
}

/**
 * Hand-written scene for the two layouts.
 */
export const layouts: Scene = {
  about: "table.layout.about",
  axes: ["layout"],
  draw: () => (
    <Matrix knob="layout" of={LAYOUTS}>
      {(layout) => (
        <Room size="sm">
          {layout === "fixed" ? <examples.fixed.Fixed /> : <examples.accounts.Accounts />}
        </Room>
      )}
    </Matrix>
  ),
  example: examples.fixed,
  title: "table.layout.title",
};

/**
 * Hand-written scene for columns that sort on a press.
 */
export const sorting: Scene = {
  about: "table.sorting.about",
  draw: () => (
    <Room size="sm">
      <examples.sortable.Sortable />
    </Room>
  ),
  example: examples.sortable,
  title: "table.sorting.title",
};

/**
 * Hand-written scene for headers that span columns.
 */
export const quarters: Scene = {
  about: "table.quarters.about",
  draw: examples.quarters.Quarters,
  example: examples.quarters,
  title: "table.quarters.title",
};

/**
 * Hand-written scene for headers that span rows.
 */
export const runs: Scene = {
  about: "table.runs.about",
  draw: () => (
    <Room size="sm">
      <examples.runs.Runs />
    </Room>
  ),
  example: examples.runs,
  title: "table.runs.title",
};

/**
 * Hand-written scene for rows grouped into sections.
 */
export const sections: Scene = {
  about: "table.sections.about",
  draw: () => (
    <Room size="sm">
      <examples.sections.Sections />
    </Room>
  ),
  example: examples.sections,
  title: "table.sections.title",
};

/**
 * Hand-written scene for a table with no rows.
 */
export const empty: Scene = {
  about: "table.empty.about",
  draw: () => (
    <Room size="sm">
      <examples.empty.Empty />
    </Room>
  ),
  example: examples.empty,
  title: "table.empty.title",
};

/**
 * Hand-written scene for sticky header rows, scrolled down two rows.
 */
export const stickyHeader: Scene = {
  about: "table.stickyHeader.about",
  axes: ["stickyHeader"],
  draw: () => <Held rows={2} stickyHeader />,
  example: examples.weeks,
  props: { stickyHeader: true },
  title: "table.stickyHeader.title",
};

/**
 * Hand-written scene for a sticky first column, scrolled sideways.
 */
export const stickyColumn: Scene = {
  about: "table.stickyColumn.about",
  axes: ["stickyColumn"],
  draw: () => <Held columns={2} stickyColumn />,
  example: examples.weeks,
  props: { stickyColumn: true },
  title: "table.stickyColumn.title",
};

/**
 * Hand-written scene for sticky header rows and a sticky first column, scrolled both ways.
 */
export const stickyBoth: Scene = {
  about: "table.stickyBoth.about",
  axes: ["stickyColumn", "stickyHeader"],
  draw: () => <Held columns={2} rows={2} stickyColumn stickyHeader />,
  example: examples.weeks,
  props: { stickyColumn: true, stickyHeader: true },
  title: "table.stickyBoth.title",
};

export default specimen({
  about: "table.about",
  id: "components/collections/table",
  imports: 'import { Table } from "@stealthscale/component-collections";',
  scenes: [
    ...scenesOf<Drawn>(recipe, {
      axes: {
        align: {
          draw: (props) => (
            <Room size="sm">
              <examples.notes.Notes {...props} />
            </Room>
          ),
          example: examples.notes,
        },
        interactive: {
          draw: (props) => (
            <Staged hover>
              <examples.linked.Linked {...props} />
            </Staged>
          ),
          example: examples.linked,
        },
        palette: {
          draw: (props) => (
            <Staged hover>
              <examples.linked.Linked {...props} />
            </Staged>
          ),
          example: examples.linked,
          with: { interactive: true },
        },
        size: { across: "variant" },
      },
      draw: (props) => <examples.payouts.Payouts {...props} />,
      example: examples.payouts,
      namespace: "table",
      order: ["size", "align", "radius", "rules", "striped", "banded", "interactive", "palette"],
      skip: {
        layout: "a fixed layout needs declared widths, so a hand-written scene draws both layouts",
        stickyColumn: "the three held scenes at the foot of the page stage a scroll position",
        stickyHeader: "the three held scenes at the foot of the page stage a scroll position",
      },
    }),
    layouts,
    sorting,
    quarters,
    runs,
    sections,
    empty,
    stickyHeader,
    stickyColumn,
    stickyBoth,
  ],
  title: "table.title",
});
