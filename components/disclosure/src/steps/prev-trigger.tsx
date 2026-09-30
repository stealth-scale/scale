/**
 * Renders the button that moves the flow to the previous step.
 *
 * @remarks
 *   The element is a `button`. On the first step it sets `aria-disabled` in place of the machine's
 *   `disabled`, so it keeps focus after the press that moved the flow to the first step, and a
 *   press on it changes nothing. Pass the library's `Button` through `as` for a button's look.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#steps/context.ts";
import { useSteps } from "#steps/machine.ts";

/**
 * Renders the `button` with the steps' previous trigger class.
 */
const Pressed = withContext("button", "prevTrigger");

/**
 * Describes the props of the previous trigger: the props of a `button`.
 */
export type PrevTriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the previous trigger with the machine's props, `aria-disabled` in place of `disabled`,
 * merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function PrevTrigger(props: PrevTriggerProps): ReactElement {
  const { api } = useSteps();
  const previous: PrevTriggerProps = {
    ...api.getPrevTriggerProps(),
    "aria-disabled": api.hasPrevStep ? undefined : true,
    disabled: undefined,
  };

  return <Pressed {...mergeProps(previous, props)} />;
}
