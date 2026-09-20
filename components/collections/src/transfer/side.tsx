/**
 * Draws one side of a transfer: its name, the rows it holds, and what it says when it holds none.
 *
 * @remarks
 *   A side is an ordinary list of several. What makes the pair a transfer is the controls between
 *   them, not anything either list does differently, so this adds nothing to a listbox but the room
 *   it keeps and the rows it is handed.
 *   The room is a floor rather than a fixed measure, counted in rows off the height the list
 *   publishes for one of its own. A side that took its own height would shrink as it emptied and
 *   the pair would jump every time a row crossed between them. A side held to that measure exactly
 *   would come out shorter than the other wherever the rows carry a second line, which the
 *   published height does not account for.
 */

import { type ReactElement, type ReactNode } from "react";

import { type ListCollection } from "@zag-js/collection";

import * as Listbox from "#listbox/index.ts";
import { ROW_HEIGHT } from "#listbox/recipe.ts";
import { withContext } from "#transfer/context.ts";

/**
 * Draws the box one list sits in.
 */
const Held = withContext("div", "side");

/**
 * Describes what one side of a transfer takes.
 *
 * @typeParam Row - What one row of the list holds.
 */
export interface SideProps<Row> {
  /**
   * The rows this side holds, in the order they are drawn.
   */
  readonly collection: ListCollection<Row>;

  /**
   * Drawn under a row's name, for a name that does not say enough on its own.
   */
  readonly description?: ((row: Row) => ReactNode) | undefined;

  /**
   * Reads the value a row is chosen by.
   */
  readonly itemToValue: (row: Row) => string;

  /**
   * The mark a picked row carries in its box.
   */
  readonly mark?: ReactNode | undefined;

  /**
   * Said where this side holds nothing at all.
   */
  readonly nothing?: ReactNode | undefined;

  /**
   * Hears which of this side's rows a reader has picked.
   */
  readonly onPick: (picked: readonly string[]) => void;

  /**
   * The rows of this side a reader has picked.
   */
  readonly picked: readonly string[];

  /**
   * How many rows of room the side keeps, whichever side the rows are on.
   */
  readonly tall: number;

  /**
   * The words this side is named by.
   */
  readonly title: ReactNode;
}

/**
 * Draws one list of a transfer.
 *
 * @typeParam Row - What one row of the list holds.
 * @param props - The rows this side holds, what a reader has picked of them, and what names it.
 * @returns The side, holding its list.
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
  return (
    <Held>
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
        <Listbox.Content
          style={{ flex: 1, minBlockSize: `calc(var(${ROW_HEIGHT}) * ${String(tall)})` }}
        >
          {collection.items.map((row) => (
            <Listbox.Row
              {...(description === undefined ? {} : { description: description(row) })}
              item={row}
              key={itemToValue(row)}
            >
              {collection.stringifyItem(row)}
            </Listbox.Row>
          ))}
          {nothing === undefined ? null : <Listbox.Empty>{nothing}</Listbox.Empty>}
        </Listbox.Content>
      </Listbox.Root>
    </Held>
  );
}
