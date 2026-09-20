/**
 * Writes the value in a run of text.
 *
 * @remarks
 *   The element is `span`. It writes the machine's value where a caller hands it no children, so a
 *   page shows the value it copies without stating it twice.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Draws the run of text the recipe places.
 */
const Written = withContext("span", "valueText");

/**
 * Describes what the value text takes.
 */
export type ValueTextProps = ComponentProps<typeof Written>;

/**
 * Shows the value the clipboard copies.
 *
 * @param props - Everything a styled span takes.
 * @returns The run of text, holding the value unless a caller wrote something else.
 */
export function ValueText({ children, ...rest }: ValueTextProps): ReactElement {
  const api = useClipboard();

  return <Written {...rest}>{children ?? api.value}</Written>;
}
