/**
 * Renders the control that sends the message, or stops a running response.
 *
 * @remarks
 *   The control is the actions `Button`, square, small, in the solid look, at the end of the row of
 *   controls. It sends the form, named by `label`, and is `aria-disabled` while there is nothing to
 *   send, so it keeps focus and a press does nothing. While the composer is `busy` and the root
 *   takes `onStop`, the same element stops the response, named by `stopLabel` and showing
 *   `stopIcon`, so focus stays on it across the swap. The caller passes both glyphs.
 */

import { type JSX, type ReactElement, type ReactNode } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#composer/context.ts";
import { useComposerState } from "#composer/state.ts";

/**
 * Renders the actions `Button` with the composer's submit class.
 */
const Sent: (props: ButtonProps) => JSX.Element = withContext(Button, "submit");

/**
 * Describes the props of the submit control: its names, the stop glyph, and the props of the
 * actions `Button`.
 */
export interface SubmitProps extends ButtonProps {
  /**
   * Accessible name while the control sends, "Send" unless stated.
   */
  readonly label?: string | undefined;

  /**
   * Glyph while the control stops a response.
   */
  readonly stopIcon?: ReactNode;

  /**
   * Accessible name while the control stops a response, "Stop" unless stated.
   */
  readonly stopLabel?: string | undefined;
}

/**
 * Renders the control that sends, or stops while a response runs.
 *
 * @param props - The names, the stop glyph and the props of the actions `Button`, the send glyph
 *   among its children.
 * @returns The `button` element.
 */
export function Submit({
  children,
  label = "Send",
  onClick,
  stopIcon,
  stopLabel = "Stop",
  ...props
}: SubmitProps): ReactElement {
  const { busy, canSubmit, onStop } = useComposerState();
  const stop = busy ? onStop : undefined;

  return (
    <Sent
      aria-disabled={stop === undefined && !canSubmit ? true : undefined}
      aria-label={stop === undefined ? label : stopLabel}
      shape="square"
      size="sm"
      type={stop === undefined ? "submit" : "button"}
      variant="solid"
      {...props}
      onClick={(event) => {
        onClick?.(event);

        if (stop !== undefined) stop();
        else if (!canSubmit) event.preventDefault();
      }}
    >
      {stop === undefined ? children : stopIcon}
    </Sent>
  );
}
