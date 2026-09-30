/**
 * Renders a button that runs one action of the timer: start, pause, resume, reset or restart.
 *
 * @remarks
 *   The element is the library's `Button`. The machine hides a trigger while its action does not
 *   apply: Start while the timer runs or is paused, Pause unless it runs, Resume unless it is
 *   paused, Reset while it is idle. In the frame after a restart the triggers show as they do while
 *   the timer runs. A trigger that the machine hides while it has focus moves focus to the first
 *   trigger of the timer that shows, so a press on Start leaves focus on Pause.
 */

import { type JSX, type ReactElement, useLayoutEffect, useRef } from "react";

import { mergeProps } from "@zag-js/react";
import { type TimerAction } from "@zag-js/timer";

import { Button, type ButtonProps } from "@stealthscale/component-actions";

import { withContext } from "#timer/context.ts";
import { handOff, track, untrack } from "#timer/handoff.ts";
import { useTimer } from "#timer/machine.ts";

/**
 * Renders the library's `Button` with the timer's action trigger class.
 */
const Pressed: (props: ButtonProps) => JSX.Element = withContext(Button, "actionTrigger");

/**
 * Describes the props of an action trigger: the action and the props of a `Button`, without `ref`.
 */
export interface ActionTriggerProps extends Omit<ButtonProps, "ref"> {
  /**
   * Action a press runs.
   */
  readonly action: TimerAction;
}

/**
 * Renders the trigger with the machine's props merged under the caller's.
 *
 * @param props - The action and the props of a `Button`.
 * @returns The `button` element.
 */
export function ActionTrigger({ action, ...props }: ActionTriggerProps): ReactElement {
  const { api, restarting } = useTimer();
  const ref = useRef<HTMLButtonElement>(null);
  const trigger: ButtonProps = api.getActionTriggerProps({ action });
  const hidden = restarting ? action === "start" || action === "resume" : trigger.hidden === true;

  useLayoutEffect(() => {
    if (hidden && ref.current !== null) handOff(ref.current);
  }, [hidden]);

  return (
    <Pressed
      {...mergeProps(trigger, { hidden, onBlur: untrack, onFocus: track }, props)}
      ref={ref}
    />
  );
}
