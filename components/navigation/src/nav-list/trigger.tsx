/**
 * Draws the row that opens a branch.
 *
 * @remarks
 *   The element is `button`, because it acts on the page rather than going anywhere. The machine
 *   writes what tells a screen reader what it does: whether the list is expanded, and which list
 *   it controls. Neither is this component's to state, because the machine holds the id both sides
 *   are named by.
 *   A branch whose own page is the one being read states `aria-current="page"` here, the same as a
 *   link does, and the `highlight` axis marks it the same way.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/state.ts";

/**
 * Draws the row at the size the list states.
 */
const Opened = withContext("button", "trigger");

/**
 * Describes what a trigger takes.
 */
export type TriggerProps = Omit<
  ComponentProps<typeof Opened>,
  "aria-controls" | "aria-expanded" | "type"
>;

/**
 * Shows the list beneath the row where it is hidden, and hides it where it is shown.
 *
 * @param props - Everything a styled button takes, less what the machine states.
 * @returns The row, saying what it controls and whether that list is open.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useBranch();

  return <Opened {...mergeProps(api.getTriggerProps(), props)} />;
}
