/**
 * Renders the button that dismisses a toast.
 *
 * @remarks
 *   The machine names the button "Dismiss notification" unless the caller passes `aria-label`. The
 *   caller passes the glyph. The recipe centres the button on the first line of the title and puts
 *   the glyph on the toast's padding edge.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toast/context.ts";
import { useToast } from "#toast/machine.ts";

/**
 * Renders the `button` with the toast's close trigger class.
 */
const Drawn = withContext("button", "closeTrigger");

/**
 * Describes the props of the close trigger: the props of a `button`.
 */
export type CloseTriggerProps = ComponentProps<typeof Drawn>;

/**
 * Renders the close trigger with the machine's props merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function CloseTrigger(props: CloseTriggerProps): ReactElement {
  const api = useToast();

  return <Drawn {...mergeProps(api.getCloseTriggerProps(), props)} />;
}
