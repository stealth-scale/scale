/**
 * Renders the alert container and provides the variants to the parts.
 *
 * @remarks
 *   The element is a `div` whose role follows `live`. Use `assertive` for an alert raised by a
 *   user action, `polite` for progress, and `off` for a notice present at first render. Screen
 *   readers announce changes to a live region already in the document and do not reliably announce
 *   a region mounted with its text, so a surface that raises alerts keeps an empty region mounted
 *   and writes into it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#alert/context.ts";
import { type Live, ROLES } from "#alert/live.ts";

/**
 * Div with the root slot classes that provides the variants.
 */
const Framed = withProvider("div", "root");

/**
 * Describes the props of Alert.Root: the announcement level, the recipe's variants and the props
 * of a div element.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Announcement level, which sets the role. Defaults to `polite`.
   */
  readonly live?: Live | undefined;
}

/**
 * Renders a div with the role of its announcement level.
 *
 * @remarks
 *   The role comes before the caller's props, so a `role` prop overrides it.
 */
export function Root({ live = "polite", ...rest }: RootProps): ReactElement {
  return <Framed {...ROLES[live]} {...rest} />;
}
