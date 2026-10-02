/**
 * Renders what is wrong with the field's value, or the status it reports.
 *
 * @remarks
 *   The element is a `p` with the identifier the control's `aria-describedby` lists. It renders
 *   while the field is invalid or reports a status, and nothing otherwise. It sets `role="alert"`
 *   only while the field is invalid, so an error raised on submit is announced and a status that
 *   is not a fault is not. The ink comes from the palette the root's `status` sets, and defaults
 *   to the error palette. A leading `svg` is sized to the text and centred on its first line.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Renders the `p` with the field's error text class.
 */
const Worded = withContext("p", "errorText");

/**
 * Describes the props of the error text: the props of a `p`.
 */
export type ErrorTextProps = ComponentProps<typeof Worded>;

/**
 * Renders the error text while the field is invalid or reports a status.
 *
 * @param props - The props of a `p`.
 * @returns The error text, or nothing.
 */
export function ErrorText(props: ErrorTextProps): ReactElement | undefined {
  const { ids, invalid, status } = useField();

  if (!invalid && status === undefined) return undefined;

  return <Worded id={ids.errorText} {...(invalid ? { role: "alert" } : {})} {...props} />;
}
