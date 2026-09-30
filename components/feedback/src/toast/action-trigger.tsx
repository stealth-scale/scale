/**
 * Renders the button that runs a toast's action and dismisses the toast.
 *
 * @remarks
 *   A press calls the `action.onClick` the toast was raised with, then dismisses the toast. The
 *   caller renders the action's `label` as the button's words.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toast/context.ts";
import { useToast } from "#toast/machine.ts";

/**
 * Renders the `button` with the toast's action trigger class.
 */
const Drawn = withContext("button", "actionTrigger");

/**
 * Describes the props of the action trigger: the props of a `button`.
 */
export type ActionTriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the action trigger with the machine's props merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function ActionTrigger(props: ActionTriggerProps): ReactElement {
  const api = useToast();

  return <Drawn {...mergeProps(api.getActionTriggerProps(), props)} />;
}
