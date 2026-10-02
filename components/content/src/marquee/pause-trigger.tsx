/**
 * Renders the control that pauses the marquee and plays it again.
 *
 * @remarks
 *   WCAG 2.2.2 asks for a way to pause moving content that starts by itself and runs longer than
 *   five seconds, and a pause that lasts only while the pointer or focus rests on it does not
 *   count. The control sets the reader's choice, which a pointer leaving the marquee does not undo.
 *   The element is the actions `Button` as a square, surface and `xs` unless the caller sets a
 *   variant or a size, over the marquee's end. Its name states the action a press takes: "Pause"
 *   while the marquee moves by choice, "Play" while the reader has paused it, unless the caller
 *   passes `pauseLabel` and `playLabel`. The recipe hides it under reduced motion, where nothing
 *   moves.
 */

import { type ReactElement } from "react";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#marquee/context.ts";
import { useMarquee } from "#marquee/machine.ts";

/**
 * Renders the actions `Button` as a square with the marquee's pause trigger class, surface and `xs`
 * unless the caller sets a variant or a size.
 */
const Drawn: (props: ButtonProps) => ReactElement = withContext(Button, "pauseTrigger", {
  defaultProps: { shape: "square", size: "xs", variant: "surface" },
});

/**
 * Describes the props of the pause control: the names of its two actions and the props of a
 * `Button`.
 */
export interface PauseTriggerProps extends Omit<ButtonProps, "aria-label" | "aria-labelledby"> {
  /**
   * Name of the control while the marquee moves by the reader's choice, "Pause" unless the caller
   * passes another.
   */
  readonly pauseLabel?: string | undefined;

  /**
   * Name of the control while the reader has paused the marquee, "Play" unless the caller passes
   * another.
   */
  readonly playLabel?: string | undefined;
}

/**
 * Renders the control, which reverses the reader's choice on a press the caller did not cancel.
 *
 * @param props - The names of the two actions and the props of a `Button`.
 * @returns The `button` element.
 */
export function PauseTrigger({
  onClick,
  pauseLabel = "Pause",
  playLabel = "Play",
  ...props
}: PauseTriggerProps): ReactElement {
  const { pausing } = useMarquee();

  return (
    <Drawn
      {...props}
      aria-label={pausing.chosen ? playLabel : pauseLabel}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) pausing.toggle();
      }}
    />
  );
}
