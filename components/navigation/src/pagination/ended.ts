/**
 * Prepares the props of a trigger that moves between pages.
 *
 * @remarks
 *   The machine disables a trigger at the first or the last page. A press that moves to that page
 *   would then disable the pressed button, and the browser moves focus to the page's body. The
 *   trigger sets `aria-disabled` in place of `disabled`, so it keeps focus, and the machine ignores
 *   a press that has no page to move to.
 */

import { type ButtonProps } from "@stealthscale/component-actions";

import { linked } from "#pagination/linked.ts";
import { type PaginationMachine } from "#pagination/machine.ts";

/**
 * Returns a trigger's props with `aria-disabled` in place of `disabled` at an end, as a link when
 * the machine's pages are links.
 *
 * @param props - The props the machine gives the trigger.
 * @param end - Whether the trigger has no page to move to.
 * @param type - Whether the machine's pages are buttons or links.
 * @returns The trigger's props.
 */
export function ended(
  props: ButtonProps,
  end: boolean,
  type: PaginationMachine["type"],
): ButtonProps {
  const marked = { ...props, "aria-disabled": end ? true : undefined, disabled: undefined };

  return type === "link" ? linked(marked, end) : marked;
}
