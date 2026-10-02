/**
 * Renders the element the popover is positioned against, in place of the trigger.
 *
 * @remarks
 *   The machine measures the anchor when one is rendered, and the trigger otherwise. Wrap a row in
 *   the anchor to open the popover beside the whole row.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { usePopover } from "#popover/machine.ts";

/**
 * Renders the `div` with the popover's anchor class.
 */
const Drawn = withContext("div", "anchor");

/**
 * Describes the props of the anchor: the props of a `div`.
 */
export type AnchorProps = ComponentProps<typeof Drawn>;

/**
 * Renders the anchor with the machine's anchor props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Anchor(props: AnchorProps): ReactElement {
  const api = usePopover();

  return <Drawn {...mergeProps(api.getAnchorProps(), props)} />;
}
