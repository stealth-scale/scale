/**
 * Renders one side of a transfer: a boxed listbox of several, with its title and empty text.
 *
 * @remarks
 *   The side sets `--transfer-rows` to the number of rows it keeps room for, and the recipe sizes
 *   the list from it. The number is a floor: a side whose rows have a second line grows past it.
 */

import { type ReactElement, type ReactNode } from "react";

import { type ListCollection } from "@zag-js/collection";

import * as Listbox from "#listbox/index.ts";
import { withContext } from "#transfer/context.ts";
import { ROWS } from "#transfer/recipe.ts";

/**
 * Renders the `div` around one list.
 */
const Held = withContext("div", "side");

/**
 * Describes the props of one side.
 *
 * @typeParam Row - Type of one row.
 */
export interface SideProps<Row> {
  /**
   * Rows of this side in render order.
   */
  readonly collection: ListCollection<Row>;

  /**
   * Returns a row's second line.
   */
  readonly description?: ((row: Row) => ReactNode) | undefined;

  /**
   * Returns a row's value.
   */
  readonly itemToValue: (row: Row) => string;

  /**
   * Mark of a checked row's checkbox.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * Content rendered while the side has no rows.
   */
  readonly nothing?: ReactNode | undefined;

  /**
   * Called with the values of the checked rows.
   */
  readonly onPick: (picked: readonly string[]) => void;

  /**
   * Values of the checked rows.
   */
  readonly picked: readonly string[];

  /**
   * Number of rows the side keeps room for.
   */
  readonly tall: number;

  /**
   * Label of the list.
   */
  readonly title: ReactNode;
}

/**
 * Renders one side of a transfer.
 *
 * @typeParam Row - Type of one row.
 * @param props - The rows, the checked values, the title and the room to keep.
 * @returns The `div` with the listbox inside it.
 */
export function Side<Row>({
  collection,
  description,
  itemToValue,
  mark,
  nothing,
  onPick,
  picked,
  tall,
  title,
}: SideProps<Row>): ReactElement {
  const rowed: Record<string, string> = { [ROWS]: String(tall) };

  return (
    <Held style={rowed}>
      <Listbox.Root
        boxed
        collection={collection}
        mark={mark}
        onValueChange={(next) => {
          onPick(next.value);
        }}
        selectionMode="multiple"
        value={[...picked]}
        variant="surface"
      >
        <Listbox.Label>{title}</Listbox.Label>
        <Listbox.Frame>
          <Listbox.Content>
            {collection.items.map((row) => (
              <Listbox.Row
                {...(description === undefined ? {} : { description: description(row) })}
                item={row}
                key={itemToValue(row)}
              >
                {collection.stringifyItem(row)}
              </Listbox.Row>
            ))}
          </Listbox.Content>
          {nothing === undefined ? null : <Listbox.Empty>{nothing}</Listbox.Empty>}
        </Listbox.Frame>
      </Listbox.Root>
    </Held>
  );
}
