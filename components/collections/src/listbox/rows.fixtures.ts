/**
 * Builds the rows and the collections the listbox specifications render.
 */

import { ListCollection } from "@zag-js/collection";

/**
 * Describes one row of the fixture collection.
 */
export interface Row {
  /**
   * Text the row renders and is named by.
   */
  label: string;

  /**
   * Value the row is selected by.
   */
  value: string;
}

/**
 * Rows of the fixture collection: Invoices, Reports and Settings.
 */
export const ROWS: readonly Row[] = [
  { label: "Invoices", value: "invoices" },
  { label: "Reports", value: "reports" },
  { label: "Settings", value: "settings" },
];

/**
 * Collection of the three rows.
 */
export const COLLECTION = new ListCollection<Row>({
  items: [...ROWS],
  itemToString: (row): string => row.label,
  itemToValue: (row): string => row.value,
});

/**
 * Collection with no rows.
 */
export const NOTHING = new ListCollection<Row>({
  items: [],
  itemToString: (row): string => row.label,
  itemToValue: (row): string => row.value,
});
