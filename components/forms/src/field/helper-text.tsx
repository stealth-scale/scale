/**
 * Draws the text that sits beside the field whatever its state.
 *
 * @remarks
 *   The element is `p`. It carries the identifier the control is described by, so a screen reader
 *   reads it after the field's name and before a person types.
 *   Reach for it for what a person needs to know in advance: the format a date takes, how long a
 *   password has to be. What went wrong goes in the error text.
 *   It renders nothing where the field is wrong, because the error text takes its place. Drawn
 *   together the two stood one above the other under the control, and a reader had to work out
 *   which of them to act on. A field marked wrong that states no error text therefore draws no text
 *   under the control at all, which is a field reporting a fault it does not name.
 *   A field reporting something that is not a fault draws both, because neither the state nor the
 *   status says which of the two a reader wants. A page showing a note under such a field writes
 *   the note and leaves the helper text out.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Draws the text at the size the root states.
 */
const Worded = withContext("p", "helperText");

/**
 * Describes what the text takes: everything a styled p takes.
 */
export type HelperTextProps = ComponentProps<typeof Worded>;

/**
 * Says what a person needs to know before they fill the field in.
 *
 * @param props - Everything a styled p takes.
 * @returns The text, carrying the identifier the control names it by, or nothing where the field
 *   is wrong and the error text has taken its place.
 */
export function HelperText(props: HelperTextProps): ReactElement | undefined {
  const { ids, invalid } = useField();

  if (invalid) return undefined;

  return <Worded id={ids.helperText} {...props} />;
}
