/**
 * Renders the button that closes the popover.
 *
 * @remarks
 *   The machine names the button "close". Pass `aria-label` to name it in the page's language.
 *   Escape closes the popover as well.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `button` with the popover's close trigger class.
 */
const Drawn = withContext("button", "closeTrigger");

/**
 * Describes the props of the close trigger: the props of a `button`.
 */
export type CloseTriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the close trigger with the machine's close trigger props merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function CloseTrigger(props: CloseTriggerProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getCloseTriggerProps(), props)} />;
}
