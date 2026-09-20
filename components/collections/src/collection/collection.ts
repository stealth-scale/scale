/**
 * Holds the rows a list draws and narrows them to what a reader has typed.
 *
 * @remarks
 *   The whole set is held apart from the narrowed one, so typing a letter and deleting it again
 *   restores the rows rather than re-deriving them from a source nobody kept. A machine reads the
 *   narrowed collection, which is what a list walks and announces.
 */

import { useCallback, useMemo, useState } from "react";

import { ListCollection } from "@zag-js/collection";

/**
 * Describes what a collection is built from: the rows, and how to read a row's words and value.
 *
 * @typeParam Row - What one row holds.
 */
export interface CollectionOptions<Row> {
  /**
   * Decides whether a row survives what has been typed.
   *
   * @remarks
   *   Given the row's own words, the text typed and the row itself, so a caller can match on more
   *   than the words a reader sees. Left out, a row survives on its words alone.
   */
  filter?: ((words: string, typed: string, row: Row) => boolean) | undefined;

  /**
   * Reads whether a row can be picked.
   *
   * @remarks
   *   A row that cannot be picked is still drawn and still read out, because a reader who cannot
   *   see it has no way to learn the option exists. The arrows pass over it and a press does
   *   nothing. Left out, every row can be picked.
   */
  isItemDisabled?: ((row: Row) => boolean) | undefined;

  /**
   * Reads the words a row is drawn and announced by.
   */
  itemToString: (row: Row) => string;

  /**
   * Reads the value a row is chosen by.
   */
  itemToValue: (row: Row) => string;

  /**
   * Every row, in the order they are drawn.
   */
  rows: readonly Row[];
}

/**
 * Describes what the hook answers: the rows left, and how to narrow them.
 *
 * @typeParam Row - What one row holds.
 */
export interface Collection<Row> {
  /**
   * The rows that survive what has been typed, in the order they were given.
   */
  collection: ListCollection<Row>;

  /**
   * Narrows the rows to what matches, or restores every row where nothing has been typed.
   */
  narrow: (typed: string) => void;
}

/**
 * Keeps the rows and the text typed, and answers what is left of them.
 *
 * @typeParam Row - What one row holds.
 * @param options - The rows, how to read one, and how to match one.
 * @returns The rows left and how to narrow them.
 */
export function useListCollection<Row>(options: CollectionOptions<Row>): Collection<Row> {
  const { filter, isItemDisabled, itemToString, itemToValue, rows } = options;
  const [typed, setTyped] = useState("");

  const collection = useMemo(() => {
    const matching =
      typed === ""
        ? rows
        : rows.filter((row) =>
            filter === undefined
              ? itemToString(row).toLowerCase().includes(typed.toLowerCase())
              : filter(itemToString(row), typed, row),
          );

    return new ListCollection({
      items: [...matching],
      ...(isItemDisabled === undefined ? {} : { isItemDisabled }),
      itemToString,
      itemToValue,
    });
  }, [filter, isItemDisabled, itemToString, itemToValue, rows, typed]);

  const narrow = useCallback((next: string): void => {
    setTyped(next);
  }, []);

  return useMemo(() => ({ collection, narrow }), [collection, narrow]);
}
