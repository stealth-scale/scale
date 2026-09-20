/**
 * Splits a set of rows between the two sides of a transfer and moves them across.
 *
 * @remarks
 *   The set that has crossed over is the caller's, driven or not. What a reader has picked on each
 *   side is held here, because a page that had to track it would be tracking a state it never reads
 *   and would clear it at the wrong moments.
 *   Picking is cleared on the side a row leaves. A row that crossed over while still counted as
 *   picked would be taken straight back by the next press of the other control.
 */

import { useCallback, useMemo, useState } from "react";

import { type ListCollection } from "@zag-js/collection";

import { useListCollection } from "#collection/collection.ts";

/**
 * Describes what splitting a set between two sides is given.
 *
 * @typeParam Row - What one row holds.
 */
export interface CrossingOptions<Row> {
  /**
   * The rows that have crossed over before a caller drives the set.
   */
  defaultValue?: readonly string[] | undefined;

  /**
   * Reads the words a row is drawn and announced by.
   */
  itemToString: (row: Row) => string;

  /**
   * Reads the value a row is chosen by.
   */
  itemToValue: (row: Row) => string;

  /**
   * Hears the set that has crossed over, each time it changes.
   */
  onValueChange?: ((taken: readonly string[]) => void) | undefined;

  /**
   * Every row, on whichever side it sits.
   */
  rows: readonly Row[];

  /**
   * The rows that have crossed over, where a caller drives the set.
   */
  value?: readonly string[] | undefined;
}

/**
 * Describes what the two sides hold and what moves between them.
 *
 * @typeParam Row - What one row holds.
 */
export interface Crossing<Row> {
  /**
   * Sends the rows picked on the far side back.
   */
  giveBack: () => void;

  /**
   * The rows that have not crossed over.
   */
  offered: ListCollection<Row>;

  /**
   * The rows a reader has picked on the near side.
   */
  pickedOffered: readonly string[];

  /**
   * The rows a reader has picked on the far side.
   */
  pickedTaken: readonly string[];

  /**
   * Takes which of the near side's rows a reader has picked.
   */
  pickOffered: (picked: readonly string[]) => void;

  /**
   * Takes which of the far side's rows a reader has picked.
   */
  pickTaken: (picked: readonly string[]) => void;

  /**
   * Sends the rows picked on the near side over.
   */
  take: () => void;

  /**
   * The rows that have crossed over.
   */
  taken: ListCollection<Row>;
}

/**
 * Splits the rows between the two sides and answers what moves them.
 *
 * @typeParam Row - What one row holds.
 * @param options - Every row, which of them have crossed over, and how to read one.
 * @returns The two sides, what is picked on each, and the two moves.
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
