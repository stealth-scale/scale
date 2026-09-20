/**
 * Builds the transfer every specification of a part draws, so no case states the same ten props.
 */

import { type ReactElement } from "react";

import { Transfer, type TransferProps } from "#transfer/transfer.tsx";

/**
 * Describes one row every case moves between the lists.
 */
export interface Place {
  /**
   * The words the row is drawn and announced by.
   */
  label: string;

  /**
   * The value the row is chosen by.
   */
  value: string;
}

/**
 * The rows every case starts from.
 */
export const PLACES: readonly Place[] = [
  { label: "Invoices", value: "invoices" },
  { label: "Reports", value: "reports" },
  { label: "Settings", value: "settings" },
];

/**
 * Draws a transfer, less whatever a case states itself.
 *
 * @param props - Whatever the case sets on the transfer.
 * @returns The two lists and the controls between them.
 */
export function moving(props: Partial<TransferProps<Place>> = {}): ReactElement {
  return (
    <Transfer<Place>
      giveBackLabel="Give back"
      giveBackMark="<"
      itemToString={(place) => place.label}
      itemToValue={(place) => place.value}
      mark="check"
      nothing="Nothing here."
      offeredTitle="Available"
      rows={PLACES}
      takeLabel="Take"
      takeMark=">"
      takenTitle="Chosen"
      {...props}
    />
  );
}
