/**
 * Holds the rows a list draws in columns rather than one after another.
 *
 * @remarks
 *   A grid collection is what changes the keys. All four arrows move the highlight, so a reader
 *   crosses the tiles the way they see them rather than walking a whole row to reach the one
 *   below. The count of columns belongs to the collection and not to the styles, because the
 *   machine has to know where a tile's neighbours are before it can move to one; a grid drawn in
 *   four columns and told it has three answers the arrows wrongly.
 */

import { useMemo } from "react";

import { GridCollection } from "@zag-js/collection";

/**
 * Describes what a grid of rows is built from.
 *
 * @typeParam Row - What one tile holds.
 */
export interface GridOptions<Row> {
  /**
   * How many columns the tiles are laid out in.
   */
  columnCount: number;

  /**
   * Reads the words a tile is drawn and announced by.
   */
  itemToString: (row: Row) => string;

  /**
   * Reads the value a tile is chosen by.
   */
  itemToValue: (row: Row) => string;

  /**
   * Every tile, in the order they are drawn.
   */
  rows: readonly Row[];
}

/**
 * Describes what the hook answers: the tiles, knowing where each one's neighbours are.
 *
 * @typeParam Row - What one tile holds.
 */
export interface Grid<Row> {
  /**
   * The tiles, in the order they were given, knowing where each one's neighbours are.
   */
  collection: GridCollection<Row>;
}

/**
 * Builds a collection the arrows cross in two directions.
 *
 * @typeParam Row - What one tile holds.
 * @param options - The tiles, how to read one, and how many columns they run in.
 * @returns The collection, rebuilt when the tiles or the count of columns change.
 */
export function useGridCollection<Row>(options: GridOptions<Row>): Grid<Row> {
  const { columnCount, itemToString, itemToValue, rows } = options;

  const collection = useMemo(
    () => new GridCollection({ columnCount, items: [...rows], itemToString, itemToValue }),
    [columnCount, itemToString, itemToValue, rows],
  );

  return useMemo(() => ({ collection }), [collection]);
}
