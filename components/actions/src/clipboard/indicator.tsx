/**
 * Draws the mark that swaps while the copy is fresh.
 *
 * @remarks
 *   A caller hands over two glyphs: the children at rest, and `copied` for the while after a
 *   press. It states `aria-hidden`, because it sits inside the trigger and everything inside a
 *   control is read as part of that control's name, which the machine already writes to say the
 *   same thing. A caller whose mark says something the name does not can state
 *   `aria-hidden={false}`.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Draws the mark at the box the recipe states.
 */
const Marked = withContext("span", "indicator");

/**
 * Describes what the indicator takes: the glyph at rest as its children, and the one after a
 * copy.
 */
export interface IndicatorProps extends ComponentProps<typeof Marked> {
  /**
   * The glyph shown while the copy is fresh.
   */
  readonly copied?: ReactNode;
}

/**
 * Shows one glyph at rest and another for a while after a copy.
 *
 * @param props - The two glyphs, and everything a styled span takes.
 * @returns The mark, holding whichever glyph the machine's state picks.
 */
export function Indicator({ children, copied, ...rest }: IndicatorProps): ReactElement {
  const api = useClipboard();

  return (
    <Marked
      {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps({ copied: api.copied }), rest)}
    >
      {api.copied ? copied : children}
    </Marked>
  );
}
