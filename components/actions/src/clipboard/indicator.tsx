/**
 * Renders the mark that changes for a moment after a copy.
 *
 * @remarks
 *   The caller supplies two glyphs: `children` for the resting state and `copied` for the window
 *   after a successful copy. The span sets `aria-hidden` because it sits inside the trigger, whose
 *   content becomes its accessible name, and the machine already writes that name to the same
 *   effect. A caller whose mark carries something the name does not can pass `aria-hidden={false}`.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * Renders the indicator slot at the box the recipe gives it.
 */
const Marked = withContext("span", "indicator");

/**
 * Extends the styled span's props with the second glyph.
 */
export interface IndicatorProps extends ComponentProps<typeof Marked> {
  /**
   * The glyph rendered for the window following a successful copy.
   */
  readonly copied?: ReactNode;
}

/**
 * Renders whichever glyph the machine's copied state selects.
 *
 * @param props - Both glyphs, plus everything a styled span takes.
 * @returns The span, hidden from assistive technology unless the caller overrides it.
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
