/**
 * Prepares the props of a trigger that moves the carousel a page.
 *
 * @remarks
 *   The machine disables a trigger with no page to move to, and the browser then moves focus from
 *   the pressed button to the page's body. The trigger sets `aria-disabled` in place of `disabled`,
 *   so it keeps focus, and a press on it does not send an event. A press under reduced motion sends
 *   the page event with `instant`, so the page moves at once.
 */

import { type MouseEvent } from "react";

import { mergeProps } from "@zag-js/react";

import { type ButtonProps } from "@stealthscale/component-actions";

import { lookOf } from "#carousel/bound.ts";
import { type CarouselMachine } from "#carousel/machine.ts";

/**
 * Returns a trigger's props with `aria-disabled` in place of `disabled` at an end, a press that
 * sends the page event, and the look for where the controls go.
 *
 * @param machine - Where the controls go, whether pages move at once, and the machine's `send`.
 * @param props - The props the machine gives the trigger.
 * @param ended - Whether the trigger has no page to move to.
 * @param type - The page event a press sends.
 * @returns The trigger's props.
 */
export function stepping(
  machine: Pick<CarouselMachine, "controls" | "instant" | "send">,
  props: ButtonProps,
  ended: boolean,
  type: "PAGE.NEXT" | "PAGE.PREV",
): ButtonProps {
  const { controls, instant, send } = machine;

  return mergeProps(
    { ...props, disabled: undefined },
    {
      "aria-disabled": ended || undefined,

      /**
       * Sends the page event unless the caller cancelled the press or the trigger has no page to
       * move to, and stops the machine's own press handler.
       */
      onClick(event: MouseEvent<HTMLButtonElement>): void {
        if (event.defaultPrevented) return;

        event.preventDefault();

        if (!ended) send({ instant, src: "trigger", type });
      },
      variant: lookOf(controls),
    },
  );
}
