/**
 * Renders the value inline as text.
 *
 * @remarks
 *   The span falls back to the machine's value when the caller passes no children, so a page can
 *   display the string it copies without repeating it in two places.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Renders the valueText slot.
 */
const Written = withContext("span", "valueText");

/**
 * Accepts every prop the styled span takes.
 */
export type ValueTextProps = ComponentProps<typeof Written>;

/**
 * Renders the caller's children, or the machine's value where there are none.
 *
 * @param props - Everything a styled span takes.
 * @returns The span, holding one or the other.
 */
export function ValueText({ children, ...rest }: ValueTextProps): ReactElement {
  const api = useClipboard();

  return <Written {...rest}>{children ?? api.value}</Written>;
}
