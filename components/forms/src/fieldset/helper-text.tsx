/**
 * Renders what a person needs to know about the group before filling it in.
 *
 * @remarks
 *   The element is a `p` with the identifier the root's `aria-describedby` lists. Put it straight
 *   after the legend: assistive technology that reads a group's description reads it on entering
 *   the group, and one that does not reaches it in document order before the first control. Text
 *   about one field goes in that field's helper text.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#fieldset/context.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the `p` with the fieldset's helper text class.
 */
const Worded = withContext("p", "helperText");

/**
 * Describes the props of the helper text: the props of a `p`.
 */
export type HelperTextProps = ComponentProps<typeof Worded>;

/**
 * Renders the helper text.
 *
 * @param props - Attributes and children of the `p` element.
 * @returns The `p` element, with the group's helper identifier.
 */
export function HelperText(props: HelperTextProps): ReactElement {
  const { ids } = useFieldset();

  return <Worded id={ids.helperText} {...props} />;
}
