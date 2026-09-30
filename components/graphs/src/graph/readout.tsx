/**
 * Renders a preset's readout below the canvas: what the focused node means in the caller's words,
 * the control that clears the focus, and the caller's overview map at the row's end.
 *
 * @remarks
 *   The words are in an `output`, so a screen reader reads them when a node takes the focus. While
 *   nothing is focused the words are the preset's prompt. The clear control is always rendered and
 *   is `aria-disabled` while nothing is focused, so a press that clears the focus leaves the
 *   keyboard focus on it.
 */

import { type ReactElement, type ReactNode } from "react";

import { Button } from "@stealthscale/component-actions";

import { Summary } from "#graph/summary.ts";

/**
 * Describes the props of the readout: its words, whether a node is focused and what a press on the
 * control does.
 */
export interface ReadoutProps {
  /**
   * Elements at the row's end, such as the overview map.
   */
  readonly children?: ReactNode;

  /**
   * Words of the control that clears the focus.
   */
  readonly clearLabel: string;

  /**
   * Whether a node is focused, which enables the clear control.
   */
  readonly focused: boolean;

  /**
   * Called when a press clears the focus.
   */
  readonly onClear: () => void;

  /**
   * Words of the readout: the focused node's summary, or the prompt while nothing is focused.
   */
  readonly text: ReactNode;
}

/**
 * Renders the words, the clear control and the elements at the row's end in the graph's summary
 * row.
 *
 * @param props - The words, the focus, the clear handler and the elements at the row's end.
 */
export function Readout({
  children,
  clearLabel,
  focused,
  onClear,
  text,
}: ReadoutProps): ReactElement {
  return (
    <Summary>
      <output>{text}</output>
      <Button
        aria-disabled={focused ? undefined : true}
        onClick={() => {
          if (focused) onClear();
        }}
        size="sm"
        variant="outline"
      >
        {clearLabel}
      </Button>
      {children}
    </Summary>
  );
}
