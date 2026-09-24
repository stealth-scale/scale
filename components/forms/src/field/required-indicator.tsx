/**
 * Renders the mark on a field that requires a value.
 *
 * @remarks
 *   The element is a `span` inside the label, hidden from assistive technology, because the
 *   control's `required` attribute already reports the state. It renders nothing while the field
 *   is optional. Its default content is `*`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Renders the `span` with the field's required indicator class, hidden and holding `*`.
 */
const Marked = withContext("span", "requiredIndicator", {
  defaultProps: { "aria-hidden": true, children: "*" },
});

/**
 * Describes the props of the required indicator: the props of a `span`.
 */
export type RequiredIndicatorProps = ComponentProps<typeof Marked>;

/**
 * Renders the mark while the field requires a value.
 *
 * @param props - The props of a `span`.
 * @returns The mark, or nothing while the field is optional.
 */
export function RequiredIndicator(props: RequiredIndicatorProps): ReactElement | undefined {
  const { required } = useField();

  if (!required) return undefined;

  return <Marked {...props} />;
}
