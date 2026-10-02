/**
 * Renders the value as inline text.
 *
 * @remarks
 *   The span renders the machine's value when the caller passes no children, so a page shows the
 *   copied string without writing it twice.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * `span` bound to the valueText slot.
 */
const Styled = withContext("span", "valueText");

/**
 * Props of `Clipboard.ValueText`: the props of the styled `span`.
 */
export type ValueTextProps = ComponentProps<typeof Styled>;

/**
 * Renders the caller's children, or the machine's value when there are none.
 *
 * @param props - Props of the styled `span`.
 * @returns The span with the children or the value.
 */
export function ValueText({ children, ...rest }: ValueTextProps): ReactElement {
  const api = useClipboard();

  return <Styled {...rest}>{children ?? api.value}</Styled>;
}
