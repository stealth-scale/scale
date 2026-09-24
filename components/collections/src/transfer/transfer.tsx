/**
 * Renders two lists and the controls that move checked rows between them.
 *
 * @remarks
 *   The set of moved rows is the caller's, controlled with `value` or uncontrolled with
 *   `defaultValue`. The checked rows on each side are the transfer's own state. A control is
 *   disabled while no row on its side is checked. The controls are this recipe's own buttons, so
 *   the package depends on no other component package. `size` and `palette` go on the root, which
 *   provides the variants.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext, withProvider } from "#transfer/context.ts";
import { Control } from "#transfer/control.tsx";
import { useCrossing } from "#transfer/crossing.ts";
import { Side } from "#transfer/side.tsx";

/**
 * Renders the root `div` that lays out the two sides and the controls, and provides the variants.
 */
const Framed = withProvider("div", "root");

/**
 * Renders the `div` of the controls between the two sides.
 */
const Between = withContext("div", "controls");

/**
 * Describes the props of a transfer.
 *
 * @typeParam Row - Type of one row.
 */
export interface TransferProps<Row> {
  /**
   * Values of the moved rows on first render, when `value` is not set.
   */
  readonly defaultValue?: readonly string[] | undefined;

  /**
   * Returns a row's second line.
   */
  readonly description?: ((row: Row) => ReactNode) | undefined;

  /**
   * Accessible name of the control that moves checked rows back.
   */
  readonly giveBackLabel: string;

  /**
   * Content of the control that moves checked rows back.
   */
  readonly giveBackMark: ReactNode;

  /**
   * Returns a row's text.
   */
  readonly itemToString: (row: Row) => string;

  /**
   * Returns a row's value.
   */
  readonly itemToValue: (row: Row) => string;

  /**
   * Mark of a checked row's checkbox.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * Content rendered on a side with no rows.
   */
  readonly nothing?: ReactNode | undefined;

  /**
   * Label of the list rows are moved from.
   */
  readonly offeredTitle: ReactNode;

  /**
   * Called with the values of the moved rows after each move.
   */
  readonly onValueChange?: ((taken: readonly string[]) => void) | undefined;

  /**
   * Palette the checkboxes and fills of both lists read.
   */
  readonly palette?: ComponentProps<typeof Framed>["palette"];

  /**
   * Every row, on either side.
   */
  readonly rows: readonly Row[];

  /**
   * Size of the gap between the parts and of the controls.
   */
  readonly size?: ComponentProps<typeof Framed>["size"];

  /**
   * Accessible name of the control that moves checked rows across.
   */
  readonly takeLabel: string;

  /**
   * Content of the control that moves checked rows across.
   */
  readonly takeMark: ReactNode;

  /**
   * Label of the list rows are moved to.
   */
  readonly takenTitle: ReactNode;

  /**
   * Values of the moved rows, when the caller controls them.
   */
  readonly value?: readonly string[] | undefined;
}

/**
 * Renders two lists and the controls that move checked rows between them.
 *
 * @typeParam Row - Type of one row.
 * @param props - The rows, the moved values, the labels, the marks and the variants.
 * @returns The root `div` with both sides and the controls.
 */
export function Transfer<Row>({
  description,
  giveBackLabel,
  giveBackMark,
  mark,
  nothing,
  offeredTitle,
  palette,
  rows,
  size,
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
    <Framed {...omitUndefined({ palette, size })}>
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
