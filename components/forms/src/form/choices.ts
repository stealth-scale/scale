/**
 * Builds the collection a list control of a form picks from: one row per choice of the field's
 * `enum`, read by its words and keyed by its value.
 */

import { ListCollection } from "@zag-js/collection";

/**
 * Describes one choice of the list: its value and its words.
 */
export interface Choice {
  /**
   * The words the row shows.
   */
  readonly label: string;

  /**
   * The value the field takes.
   */
  readonly value: string;
}

/**
 * Builds the collection over the choices.
 *
 * @param choices - The choices, in the order the list shows them.
 * @returns The collection, each row read by its words and keyed by its value.
 */
export function collectionOf(choices: readonly Choice[]): ListCollection<Choice> {
  return new ListCollection({
    items: choices,
    itemToString: (choice: Choice): string => choice.label,
    itemToValue: (choice: Choice): string => choice.value,
  });
}
