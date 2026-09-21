/**
 * Renders the container element of an alert and publishes the variants its slots resolve against.
 *
 * @remarks
 *   The element is a `div` whose ARIA role is derived from `live`, because the role decides
 *   whether a user who is not looking at the region is interrupted: `assertive` for an alert
 *   raised in response to a user action, `polite` for progress reporting, `off` for a notice
 *   present from the initial render. Assistive technology announces mutations to a live region
 *   that is already in the document, and mounting the region together with its text is unreliable
 *   across screen readers, so a surface that raises alerts dynamically should keep an empty region
 *   mounted and write into it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#alert/context.ts";
import { type Live, ROLES } from "#alert/live.ts";

/**
 * Renders the root slot as a styled `div` and provides the resolved variants to its descendants.
 */
const Framed = withProvider("div", "root");

/**
 * The recipe variants, the announcement level, and the props of a styled `div`.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * The announcement level, which selects the root's ARIA role. Defaults to `polite`.
   */
  readonly live?: Live | undefined;
}

/**
 * Renders an alert container carrying the ARIA role its announcement level implies.
 *
 * @remarks
 *   The role is spread before the caller's own props, so a caller that passes `role` explicitly
 *   overrides the one `live` selected.
 */
export function Root({ live = "polite", ...rest }: RootProps): ReactElement {
  return <Framed {...ROLES[live]} {...rest} />;
}
