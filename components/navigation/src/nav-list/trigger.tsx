/**
 * Renders the row that expands and collapses a branch.
 *
 * @remarks
 *   The element is `button`, because the row changes state instead of navigating. The machine sets
 *   `aria-expanded`, and sets `aria-controls` to the content id it generates. A branch whose own
 *   page is current sets `aria-current="page"` on the trigger, and the `highlight` axis marks it
 *   the same way as a link.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/machine.ts";

/**
 * Renders the trigger `button` with the list's variants.
 */
const Opened = withContext("button", "trigger");

/**
 * Describes the props of `Trigger`, less the attributes the machine sets.
 */
export type TriggerProps = Omit<
  ComponentProps<typeof Opened>,
  "aria-controls" | "aria-expanded" | "type"
>;

/**
 * Renders the trigger with the machine's trigger props merged under the caller's.
 */
export function Trigger(props: TriggerProps): ReactElement {
  const api = useBranch();

  return <Opened {...mergeProps(api.getTriggerProps(), props)} />;
}
