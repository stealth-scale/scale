/**
 * Splits the rows between the two sides of a transfer and moves checked rows across.
 *
 * @remarks
 *   The set of moved rows is controlled with `value` or uncontrolled with `defaultValue`. The
 *   checked rows on each side are local state. A move clears the checked rows on the side it moves
 *   them from, so the next press of the other control does not move them straight back.
 */

import { useCallback, useMemo, useState } from "react";

import { type ListCollection } from "@zag-js/collection";

import { useListCollection } from "#collection/collection.ts";

/**
 * Describes the options of {@link useCrossing}.
 *
 * @typeParam Row - Type of one row.
 */
export interface CrossingOptions<Row> {
  /**
   * Values of the moved rows on first render, when `value` is not set.
   */
  defaultValue?: readonly string[] | undefined;

  /**
   * Returns a row's text.
   */
  itemToString: (row: Row) => string;

  /**
   * Returns a row's value.
   */
  itemToValue: (row: Row) => string;

  /**
   * Called with the values of the moved rows after each move.
   */
  onValueChange?: ((taken: readonly string[]) => void) | undefined;

  /**
   * Every row, on either side.
   */
  rows: readonly Row[];

  /**
   * Values of the moved rows, when the caller controls them.
   */
  value?: readonly string[] | undefined;
}

/**
 * Describes the two sides, the checked rows on each and the two moves.
 *
 * @typeParam Row - Type of one row.
 */
export interface Crossing<Row> {
  /**
   * Moves the checked rows of the second side back to the first.
   */
  giveBack: () => void;

  /**
   * Rows that have not moved.
   */
  offered: ListCollection<Row>;

  /**
   * Values of the checked rows on the first side.
   */
  pickedOffered: readonly string[];

  /**
   * Values of the checked rows on the second side.
   */
  pickedTaken: readonly string[];

  /**
   * Sets the checked rows on the first side.
   */
  pickOffered: (picked: readonly string[]) => void;

  /**
   * Sets the checked rows on the second side.
   */
  pickTaken: (picked: readonly string[]) => void;

  /**
   * Moves the checked rows of the first side to the second.
   */
  take: () => void;

  /**
   * Rows that have moved.
   */
  taken: ListCollection<Row>;
}

/**
 * Returns the two sides, the checked rows on each and the two moves.
 *
 * @typeParam Row - Type of one row.
 * @param options - The rows, the moved values and the row readers.
 * @returns The two collections, the checked values, their setters and the moves.
 */
export function useCrossing<Row>(options: CrossingOptions<Row>): Crossing<Row> {
  const { defaultValue = [], itemToString, itemToValue, onValueChange, rows, value } = options;
  const [held, setHeld] = useState<readonly string[]>(defaultValue);
  const [pickedOffered, pickOffered] = useState<readonly string[]>([]);
  const [pickedTaken, pickTaken] = useState<readonly string[]>([]);
  const crossed = value ?? held;

  const split = useMemo(() => {
    const over = new Set(crossed);

    return {
      offered: rows.filter((row) => !over.has(itemToValue(row))),
      taken: rows.filter((row) => over.has(itemToValue(row))),
    };
  }, [crossed, itemToValue, rows]);

  const { collection: offered } = useListCollection({
    itemToString,
    itemToValue,
    rows: split.offered,
  });
  const { collection: taken } = useListCollection({ itemToString, itemToValue, rows: split.taken });

  const cross = useCallback(
    (next: readonly string[]): void => {
      if (value === undefined) setHeld(next);
      onValueChange?.(next);
    },
    [onValueChange, value],
  );

  const take = useCallback((): void => {
    cross([...crossed, ...pickedOffered]);
    pickOffered([]);
  }, [cross, crossed, pickedOffered]);

  const giveBack = useCallback((): void => {
    cross(crossed.filter((each) => !pickedTaken.includes(each)));
    pickTaken([]);
  }, [cross, crossed, pickedTaken]);

  return {
    giveBack,
    offered,
    pickedOffered,
    pickedTaken,
    pickOffered,
    pickTaken,
    take,
    taken,
  };
}
