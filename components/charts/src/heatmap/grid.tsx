/**
 * Renders a heatmap's grid: its table, the key under it and the readout over the place the walk
 * shows.
 *
 * @remarks
 *   The table scrolls sideways in the collections table's scroll area, whose viewport takes no tab
 *   stop, because the grid's one tab stop is a cell. The row headings are sticky at the start while
 *   the table scrolls. The grid scrolls the initial cell into its scroll area when it mounts, so
 *   the readout there is in view in a narrow room. The readout's heading is the reading's `label`,
 *   else its row's and its column's words.
 */

import { type ReactElement, type ReactNode, useRef } from "react";

import { Table } from "@stealthscale/component-collections";
import { omitUndefined, useSafeLayoutEffect } from "@stealthscale/hooks";

import { Frame, type HeatShape, type HeatSize } from "#heat/grid.ts";
import { Key } from "#heat/key.tsx";
import { Readout } from "#heat/readout.tsx";
import { cellIn, type Places, reveal, useWalk } from "#heat/walk.ts";
import { type HeatmapCell, type Place, type Resolved, textOf } from "#heatmap/cells.ts";
import { HeatmapTable, type HeatmapTableProps } from "#heatmap/table.tsx";

/**
 * Describes the props of a heatmap's grid: the table's props, the walk's start, the selection's
 * handler and the recipe's variants.
 *
 * @typeParam Cell - A reading, as the caller passes it.
 */
export interface HeatmapGridProps<Cell extends HeatmapCell> extends Omit<
  HeatmapTableProps<Cell>,
  "shown" | "walk"
> {
  /**
   * Key of the place the readout shows first, if any.
   */
  readonly initial: string | undefined;

  /**
   * Called with the reading of the cell Enter, Space or a press selects.
   */
  readonly onSelect: ((cell: Cell) => void) | undefined;

  /**
   * Shape of the cells.
   */
  readonly shape: HeatShape | undefined;

  /**
   * Size of the cells.
   */
  readonly size: HeatSize | undefined;
}

/**
 * Returns the readout's heading for a place: its reading's label, else its row's words and its
 * column's.
 */
function headingOf(resolved: Resolved, place: Place): ReactNode {
  const label = place.reading?.label;

  if (label !== undefined) return label;

  const row = resolved.lines.find((line) => line.heading.key === place.row)?.heading.label;
  const column = resolved.columns.find((heading) => heading.key === place.column)?.label;

  return (
    <>
      {row} · {column}
    </>
  );
}

/**
 * Returns the keys the walk moves between, row by row: every place's key, except a pair without a
 * reading in a sparse grid, which the walk passes over.
 */
function placesOf(resolved: Resolved, sparse: boolean): Places {
  return resolved.lines.map((line) =>
    line.places.map((place) => (sparse && place.reading === undefined ? undefined : place.key)),
  );
}

/**
 * Renders the table, the key and the readout.
 *
 * @param props - The headings and places, the scale, the words, the walk's start and the variants.
 */
export function HeatmapGrid<Cell extends HeatmapCell>(props: HeatmapGridProps<Cell>): ReactElement {
  const { initial, onSelect, shape, size, ...table } = props;
  const { paint, resolved, words, write } = table;
  const frame = useRef<HTMLDivElement>(null);
  const walk = useWalk(placesOf(resolved, table.sparse), {
    initial,
    onSelect: (key: string): void => {
      const reading = resolved.byKey.get(key)?.reading;

      if (reading !== undefined) onSelect?.(reading);
    },
  });
  const shown = walk.shown === undefined ? undefined : resolved.byKey.get(walk.shown);

  useSafeLayoutEffect(() => {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the frame renders before its layout effects run
    const root = frame.current as HTMLDivElement;
    const cell = initial === undefined ? undefined : cellIn(root, initial);

    if (cell !== undefined) reveal(cell, root);
  }, [initial]);

  return (
    <Frame ref={frame} {...omitUndefined({ shape, size })}>
      <Table.Scroller focusable={false}>
        <HeatmapTable {...table} shown={shown} walk={walk} />
      </Table.Scroller>
      <Key label={words.value} paint={paint} write={write} />
      <Readout
        heading={shown === undefined ? undefined : headingOf(resolved, shown)}
        rows={
          shown === undefined
            ? []
            : [{ key: "value", name: words.value, value: textOf(shown, write, words.missing) }]
        }
        target={shown?.key}
      />
    </Frame>
  );
}
