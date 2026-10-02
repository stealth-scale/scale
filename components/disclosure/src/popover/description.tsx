/**
 * Renders the popover's description.
 *
 * @remarks
 *   While the description is mounted, the panel's `aria-describedby` points at it, so a screen
 *   reader reads it after the title.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#popover/context.ts";
import { useDescribed, usePopover } from "#popover/machine.ts";

/**
 * Renders the `p` with the popover's description class.
 */
const Drawn = withContext("p", "description");

/**
 * Describes the props of the description: the props of a `p`.
 */
export type DescriptionProps = ComponentProps<typeof Drawn>;

/**
 * Renders the description with the machine's description props merged over the caller's, and
 * reports it to the root.
 *
 * @param props - The props of a `p`.
 * @returns The `p` element.
 */
export function Description(props: DescriptionProps): ReactElement {
  const api = usePopover();

  useDescribed();

  return <Drawn {...mergeProps(api.getDescriptionProps(), props)} />;
}
