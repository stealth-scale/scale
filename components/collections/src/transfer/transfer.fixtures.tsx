/**
 * Fixtures for the transfer specs: three rows and a transfer builder.
 */

import { type ReactElement } from "react";

import { Transfer, type TransferProps } from "#transfer/transfer.tsx";

/**
 * Describes one row of the fixture.
 */
export interface Place {
  /**
   * Text of the row.
   */
  label: string;

  /**
   * Value of the row.
   */
  value: string;
}

/**
 * Rows of the fixture.
 */
export const PLACES: readonly Place[] = [
  { label: "Invoices", value: "invoices" },
  { label: "Reports", value: "reports" },
  { label: "Settings", value: "settings" },
];

/**
 * Renders a transfer over the fixture's rows with the props the case sets.
 *
 * @param props - The props the case sets.
 * @returns The transfer.
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
