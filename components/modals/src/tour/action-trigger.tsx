/**
 * Renders a button that runs one of the step's actions: the next step, the previous step, the end
 * of the tour, or a function.
 *
 * @remarks
 *   The button's label is its accessible name. The machine's own names, such as "next step" on a
 *   button that reads Continue, are dropped, because a name that leaves out the visible label fails
 *   WCAG 2.5.3. At the first or the last step a previous or next button is `aria-disabled`, does
 *   nothing on a press and keeps focus. The element has a control's cursor, focus ring and disabled
 *   look, and no fill, edge or padding, so a caller passes a button through `as`. The label is the
 *   action's `label` unless the caller passes children.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";
import { type StepAction } from "@zag-js/tour";

import { withContext } from "#tour/context.ts";
import { useTourContext } from "#tour/machine.ts";

/**
 * Renders the `button` with the tour's action trigger class.
 */
const Drawn = withContext("button", "actionTrigger");

/**
 * Describes the props of the action trigger: the action and the props of a `button`.
 */
export interface ActionTriggerProps extends ComponentProps<typeof Drawn> {
  /**
   * The step action the button runs, one of the step's `actions`.
   */
  readonly action: StepAction;
}

/**
 * Renders the action trigger with the machine's props for the action merged over the caller's.
 *
 * @param props - The action and the props of a `button`.
 * @returns The `button` element.
 */
export function ActionTrigger({ action, children, ...props }: ActionTriggerProps): ReactElement {
  const api = useTourContext();
  const {
    "aria-label": _label,
    disabled,
    onClick,
    ...machine
  }: ComponentProps<typeof Drawn> = { ...api.getActionTriggerProps({ action }) };
  const pressable = disabled === true ? { "aria-disabled": true } : { onClick };

  return (
    <Drawn {...mergeProps({ ...machine, ...pressable }, props)}>{children ?? action.label}</Drawn>
  );
}
