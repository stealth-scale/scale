/**
 * Draws what went wrong with the field.
 *
 * @remarks
 *   The element is `p`. It renders where the field is wrong or where the root states what it is
 *   reporting, and nothing otherwise, so a screen reader moving through the form never reaches a
 *   message about a fault that is not there.
 *   It states `role="alert"` only where the field is wrong. A fault raised after a person submits
 *   has to reach a reader who is not looking at the field; a note saying an address is free does
 *   not, and announcing it as an alert would interrupt them to say nothing went wrong. The region
 *   is mounted with the message in it rather than before it, which some screen readers announce
 *   late. The alternative is an empty live region on every field of the form, which is read on the
 *   way past whether or not it holds anything.
 *   The ink is the palette's, which the root's `status` axis sets. A field reporting something
 *   other than a fault states that status once on the root and nothing else: gated on `invalid`
 *   alone, the only way to show a note in the success palette was to mark the control wrong, which
 *   draws the browser's own invalid ring in red over the status and tells a screen reader the entry
 *   is invalid.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Draws the message at the size the root states.
 */
const Worded = withContext("p", "errorText");

/**
 * Describes what the message takes: everything a styled p takes.
 */
export type ErrorTextProps = ComponentProps<typeof Worded>;

/**
 * Says what went wrong, where the field is wrong.
 *
 * @param props - Everything a styled p takes.
 * @returns The message, or nothing where the field is not wrong.
 */
export function ErrorText(props: ErrorTextProps): ReactElement | undefined {
  const { ids, invalid, status } = useField();

  if (!invalid && status === undefined) return undefined;

  return <Worded id={ids.errorText} {...(invalid ? { role: "alert" } : {})} {...props} />;
}
