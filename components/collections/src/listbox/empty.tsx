/**
 * Draws the words a list says when it holds nothing.
 *
 * @remarks
 *   A list narrowed to nothing, or one a page has not filled yet, draws no rows at all and reads
 *   as a component that failed rather than as a list with nothing in it. This says which.
 *   It draws nothing while there are rows, rather than hiding itself, because an element kept in
 *   the document with nothing in it is still a thing a screen reader walks through.
 *   The words are the caller's. This package publishes none, and a list of ports says something
 *   different when it is empty than a list of invoices does.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the words where the list has none of its own.
 */
const Nothing = withContext("span", "empty");

/**
 * Describes what the empty words take: everything a styled span element takes.
 */
export type EmptyProps = ComponentProps<typeof Nothing>;

/**
 * Says the list holds nothing, and draws nothing while it holds something.
 *
 * @param props - The words, and everything a styled span takes.
 * @returns The words, or nothing at all where the list has rows.
 */
export function Empty(props: EmptyProps): null | ReactElement {
  const api = useListbox();

  if (api.collection.size > 0) return null;

  return <Nothing {...props} />;
}
