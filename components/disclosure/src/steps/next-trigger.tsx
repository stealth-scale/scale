/**
 * Renders the button that moves the flow to the next step.
 *
 * @remarks
 *   The element is a `button`. Past the last step the machine counts the flow as completed. Once
 *   no step is left the button sets `aria-disabled` in place of the machine's `disabled`, so it
 *   keeps focus after the press that completed the flow, and a press on it changes nothing. Pass
 *   the library's `Button` through `as` for a button's look.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";

/**
 * Renders the `button` with the steps' next trigger class.
 */
const Pressed = withContext("button", "nextTrigger");

/**
 * Describes the props of the next trigger: the props of a `button`.
 */
export type NextTriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the next trigger with the machine's props, `aria-disabled` in place of `disabled`, merged
 * over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function NextTrigger(props: NextTriggerProps): ReactElement {
  const { api } = useSteps();
  const next: NextTriggerProps = {
    ...api.getNextTriggerProps(),
    "aria-disabled": api.hasNextStep ? undefined : true,
    disabled: undefined,
  };

  return <Pressed {...mergeProps(next, props)} />;
}
