/**
 * Renders the mark on a field that does not require a value.
 *
 * @remarks
 *   The element is a `span` inside the label, so its words are part of the label a screen reader
 *   reads. It renders nothing while the field requires a value. Its default content is
 *   `(optional)`, which a caller replaces with its own words or with a badge. A form where most
 *   fields are required marks the optional ones with it, in place of a required indicator on every
 *   other field.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Renders the `span` with the field's optional indicator class, with `(optional)` as its default
 * content.
 */
const Marked = withContext("span", "optionalIndicator", {
  defaultProps: { children: "(optional)" },
});

/**
 * Describes the props of the optional indicator: the props of a `span`.
 */
export type OptionalIndicatorProps = ComponentProps<typeof Marked>;

/**
 * Renders the mark while the field does not require a value.
 *
 * @param props - The props of a `span`.
 * @returns The mark, or nothing while the field requires a value.
 */
export function OptionalIndicator(props: OptionalIndicatorProps): ReactElement | undefined {
  const { required } = useField();

  if (required) return undefined;

  return <Marked {...props} />;
}
