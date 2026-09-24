/**
 * Renders what a person needs to know before filling the field in, such as a format.
 *
 * @remarks
 *   The element is a `p` with the identifier the control's `aria-describedby` lists. It renders
 *   nothing while the field is invalid, because the error text takes its place. A field that
 *   reports a status without being invalid renders both.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Renders the `p` with the field's helper text class.
 */
const Worded = withContext("p", "helperText");

/**
 * Describes the props of the helper text: the props of a `p`.
 */
export type HelperTextProps = ComponentProps<typeof Worded>;

/**
 * Renders the helper text while the field is valid.
 *
 * @param props - The props of a `p`.
 * @returns The helper text, or nothing while the field is invalid.
 */
export function HelperText(props: HelperTextProps): ReactElement | undefined {
  const { ids, invalid } = useField();

  if (invalid) return undefined;

  return <Worded id={ids.helperText} {...props} />;
}
