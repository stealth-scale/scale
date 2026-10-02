/**
 * Renders what is wrong with the group, or the status it reports.
 *
 * @remarks
 *   The element is a `p` with the identifier the root's `aria-describedby` lists. It renders while
 *   the group is invalid or reports a status, and nothing otherwise, the same as a field's error
 *   text. It sets `role="alert"` only while the group is invalid, so an error raised on submit is
 *   announced. Use it for a fault of the group, such as no option chosen or two dates in the wrong
 *   order. A fault of one field goes in that field's error text. A leading `svg` is sized to the
 *   text and centred on its first line.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#fieldset/context.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the `p` with the fieldset's error text class.
 */
const Worded = withContext("p", "errorText");

/**
 * Describes the props of the error text: the props of a `p`.
 */
export type ErrorTextProps = ComponentProps<typeof Worded>;

/**
 * Renders the error text while the group is invalid or reports a status.
 *
 * @param props - Attributes and children of the `p` element.
 * @returns The `p` element, or nothing.
 */
export function ErrorText(props: ErrorTextProps): ReactElement | undefined {
  const { ids, invalid, status } = useFieldset();

  if (!invalid && status === undefined) return undefined;

  return <Worded id={ids.errorText} {...(invalid ? { role: "alert" } : {})} {...props} />;
}
