/**
 * Builds the rows and the collection every listbox specification picks from.
 */

import { ListCollection } from "@zag-js/collection";

/**
 * Describes one row every case picks from.
 */
export interface Row {
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
export const ROWS: readonly Row[] = [
  { label: "Invoices", value: "invoices" },
  { label: "Reports", value: "reports" },
  { label: "Settings", value: "settings" },
];

/**
 * The collection every case draws.
 */
export const COLLECTION = new ListCollection<Row>({
  items: [...ROWS],
  itemToString: (row): string => row.label,
  itemToValue: (row): string => row.value,
});

/**
 * A collection holding no rows at all, for the cases that measure what a list says when it is
 * empty.
 */
export const NOTHING = new ListCollection<Row>({
  items: [],
  itemToString: (row): string => row.label,
  itemToValue: (row): string => row.value,
});
