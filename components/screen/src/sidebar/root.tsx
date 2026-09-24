/**
 * Renders the sidebar's column and marks whether it is collapsed to a rail.
 *
 * @remarks
 *   The element is a `div` with no landmark role. Each nav block inside it is a `nav` landmark
 *   named by its label, and a landmark on the root would put a second landmark around the same
 *   destinations. `iconic` is a prop and not a measurement: the app shell sets the sidebar's width,
 *   so the shell sets `iconic`. The root writes `data-iconic`, which the sidebar's parts read. A
 *   navigation list inside the sidebar takes `iconic` as its own prop.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#sidebar/context.ts";

/**
 * Renders the column and provides the variants to every part below it.
 */
const Columned = withProvider("div", "root");

/**
 * Describes the props of `Root`.
 */
export interface RootProps extends ComponentProps<typeof Columned> {
  /**
   * Whether the sidebar is collapsed to a rail of icons.
   */
  readonly iconic?: boolean | undefined;
}

/**
 * Renders the sidebar's column.
 *
 * @param props - `iconic`, the recipe's variants and the `div` element's props.
 * @returns The column, with `data-iconic` on a rail.
 */
export function Root({ iconic, ...rest }: RootProps): ReactElement {
  return <Columned {...rest} data-iconic={iconic === true ? "" : undefined} />;
}
