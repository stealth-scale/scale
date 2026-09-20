/**
 * Draws two lists and the pair of controls that move rows between them.
 *
 * @remarks
 *   For a set a person builds out of a longer one: the accounts a report covers, the ports a route
 *   calls at, the people a folder is shared with. It is worth reaching for where a reader has to
 *   see what they have chosen as a list of its own. Where they only have to tick what they want,
 *   one listbox of several says the same thing in half the room.
 *   The set is the caller's. This holds which rows a reader has picked on each side, because that
 *   is a state nobody outside cares about, and reports the set that has crossed over.
 *   The controls go off while nothing on their side is picked, so neither ever does nothing. A
 *   control that stayed on and did nothing is one a reader presses twice before believing it.
 *   The controls come from this package rather than from the button package, which keeps the
 *   collections off every other component package. They are the one element a transfer adds.
 */

import { type ReactElement, type ReactNode } from "react";

import { withContext, withProvider } from "#transfer/context.ts";
import { Control } from "#transfer/control.tsx";
import { useCrossing } from "#transfer/crossing.ts";
import { Side } from "#transfer/side.tsx";

/**
 * Draws the frame the two sides and the controls sit in.
 */
const Framed = withProvider("div", "root");

/**
 * Draws the column of controls between the two sides.
 */
const Between = withContext("div", "controls");

/**
 * Describes what a transfer takes.
 *
 * @typeParam Row - What one row holds.
 */
export interface TransferProps<Row> {
  /**
   * The rows that have crossed over before a caller drives the set.
   */
  readonly defaultValue?: readonly string[] | undefined;

  /**
   * Drawn under a row's name, for a name that does not say enough on its own.
   */
  readonly description?: ((row: Row) => ReactNode) | undefined;

  /**
   * Reads out as the name of the control that sends rows back.
   */
  readonly giveBackLabel: string;

  /**
   * Drawn inside the control that sends rows back.
   */
  readonly giveBackMark: ReactNode;

  /**
   * Reads the words a row is drawn and announced by.
   */
  readonly itemToString: (row: Row) => string;

  /**
   * Reads the value a row is chosen by.
   */
  readonly itemToValue: (row: Row) => string;

  /**
   * The mark a picked row carries in its box.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * Said by whichever side holds nothing at all.
   */
  readonly nothing?: ReactNode | undefined;

  /**
   * The words the side a reader takes rows from is named by.
   */
  readonly offeredTitle: ReactNode;

  /**
   * Hears the set that has crossed over, each time it changes.
   */
  readonly onValueChange?: ((taken: readonly string[]) => void) | undefined;

  /**
   * Every row, on whichever side it sits.
   */
  readonly rows: readonly Row[];

  /**
   * Reads out as the name of the control that takes rows across.
   */
  readonly takeLabel: string;

  /**
   * Drawn inside the control that takes rows across.
   */
  readonly takeMark: ReactNode;

  /**
   * The words the side a reader takes rows to is named by.
   */
  readonly takenTitle: ReactNode;

  /**
   * The rows that have crossed over, where a caller drives the set.
   */
  readonly value?: readonly string[] | undefined;
}

/**
 * Moves rows between two lists.
 *
 * @typeParam Row - What one row holds.
 * @param props - Every row, which of them have crossed over, and what names the sides and controls.
 * @returns The two lists and the controls between them.
 */
export function Transfer<Row>({
  description,
  giveBackLabel,
  giveBackMark,
  mark,
  nothing,
  offeredTitle,
  rows,
  takeLabel,
  takeMark,
  takenTitle,
  ...options
}: TransferProps<Row>): ReactElement {
  const crossing = useCrossing({ ...options, rows });
  const shared = {
    ...(description === undefined ? {} : { description }),
    itemToValue: options.itemToValue,
    mark,
    nothing,
    tall: rows.length,
  };

  return (
    <Framed>
      <Side
        {...shared}
        collection={crossing.offered}
        onPick={crossing.pickOffered}
        picked={crossing.pickedOffered}
        title={offeredTitle}
      />
      <Between>
        <Control
          disabled={crossing.pickedOffered.length === 0}
          label={takeLabel}
          onPress={crossing.take}
        >
          {takeMark}
        </Control>
        <Control
          disabled={crossing.pickedTaken.length === 0}
          label={giveBackLabel}
          onPress={crossing.giveBack}
        >
          {giveBackMark}
        </Control>
      </Between>
      <Side
        {...shared}
        collection={crossing.taken}
        onPick={crossing.pickTaken}
        picked={crossing.pickedTaken}
        title={takenTitle}
      />
    </Framed>
  );
}
