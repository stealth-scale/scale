/**
 * Renders the text a list shows while its collection is empty.
 *
 * @remarks
 *   The part renders nothing while the collection has rows, so no empty element reaches a screen
 *   reader. The text is the caller's.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Renders the `span` with the listbox's empty class.
 */
const Nothing = withContext("span", "empty");

/**
 * Describes the props of the empty text: the props of a `span`.
 */
export type EmptyProps = ComponentProps<typeof Nothing>;

/**
 * Renders the empty text while the collection has no rows.
 *
 * @param props - Attributes and children of the `span` element.
 * @returns The `span` element, or `null` while the collection has rows.
 */
export function Empty(props: EmptyProps): null | ReactElement {
  const api = useListbox();

  if (api.collection.size > 0) return null;

  return <Nothing {...props} />;
}
