/**
 * Renders a button in the panel that closes the drawer when pressed, such as Cancel or Apply.
 *
 * @remarks
 *   The button closes the drawer as the close trigger does, and takes no id and no part attributes
 *   from the machine, so a panel with a close trigger and several action triggers has one element
 *   per id. The element has a control's cursor, focus ring and disabled look, and no fill, edge or
 *   padding, so a caller passes a button through `as`. A handler that calls `preventDefault` keeps
 *   the drawer open.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#drawer/context.ts";
import { useDrawer } from "#drawer/machine.ts";

/**
 * Renders the `button` with the drawer's action trigger class.
 */
const Drawn = withContext("button", "actionTrigger");

/**
 * Describes the props of the action trigger: the props of a `button`.
 */
export type ActionTriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the action trigger with the machine's close handler merged over the caller's props.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function ActionTrigger(props: ActionTriggerProps): ReactElement {
  const api = useDrawer();
  const {
    "data-part": _part,
    "data-scope": _scope,
    id: _id,
    ...closing
  } = api.getCloseTriggerProps();

  return <Drawn {...mergeProps(closing, props)} />;
}
