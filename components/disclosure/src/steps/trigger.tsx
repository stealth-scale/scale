/**
 * Renders the button that moves the flow to a step.
 *
 * @remarks
 *   The element is a `button` without the machine's `tab` role, `aria-selected` and
 *   `aria-controls`. A press moves to the step. Moving past the current step asks `isStepValid`
 *   first, and a refusal calls `onStepInvalid`. In a linear flow the machine ignores every press,
 *   so the trigger of a completed step moves back through `setStep`, and the trigger of a later
 *   step is disabled.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#steps/context.ts";
import { type StepsApi, useSteps } from "#steps/machine.ts";
import { useItem } from "#steps/state.ts";

/**
 * Renders the `button` with the steps' trigger class.
 */
const Pressed = withContext("button", "trigger");

/**
 * Describes the props of the trigger: the props of a `button`.
 */
export type TriggerProps = ComponentProps<typeof Pressed>;

/**
 * Returns the props a trigger takes in a linear flow: a press back to a completed step, or
 * `disabled` on a later step.
 *
 * @param api - The connected api of the machine.
 * @param index - Index of the trigger's step.
 * @returns The props for the trigger's state.
 */
function linearly(api: StepsApi, index: number): TriggerProps {
  const state = api.getItemState({ index });

  if (!state.completed) return { disabled: state.incomplete };

  return {
    onClick: () => {
      api.setStep(index);
    },
    tabIndex: 0,
  };
}

/**
 * Renders the trigger with the machine's trigger props, less its tab semantics, merged over the
 * caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const { api, linear } = useSteps();
  const { index } = useItem();
  const trigger: TriggerProps = {
    ...api.getTriggerProps({ index }),
    "aria-controls": undefined,
    "aria-selected": undefined,
    role: undefined,
  };

  return <Pressed {...mergeProps(trigger, linear ? linearly(api, index) : {}, props)} />;
}
