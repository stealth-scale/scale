/**
 * Renders the mark that changes for the duration of the copied state.
 *
 * @remarks
 *   The caller passes two marks: `children` for the idle state and `copied` for the copied state.
 *   The span sets `aria-hidden`, because it sits inside the trigger and the machine already sets
 *   the trigger's accessible name. Pass `aria-hidden={false}` for a mark that carries information
 *   the name does not.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * `span` bound to the indicator slot.
 */
const Styled = withContext("span", "indicator");

/**
 * Props of `Clipboard.Indicator`: the props of the styled `span` and the copied mark.
 */
export interface IndicatorProps extends ComponentProps<typeof Styled> {
  /**
   * Mark rendered during the copied state.
   */
  readonly copied?: ReactNode;
}

/**
 * Renders `children` in the idle state and `copied` in the copied state.
 *
 * @param props - The two marks and the props of the styled `span`.
 * @returns The span, hidden from assistive technology unless the caller overrides `aria-hidden`.
 */
export function Indicator({ children, copied, ...rest }: IndicatorProps): ReactElement {
  const api = useClipboard();

  return (
    <Styled
      {...mergeProps({ "aria-hidden": true }, api.getIndicatorProps({ copied: api.copied }), rest)}
    >
      {api.copied ? copied : children}
    </Styled>
  );
}
