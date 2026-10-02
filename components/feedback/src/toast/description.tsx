/**
 * Renders the description of a toast.
 *
 * @remarks
 *   The machine gives the element the id the root's `aria-describedby` points at. The recipe sets
 *   it in the muted ink.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toast/context.ts";
import { useToast } from "#toast/machine.ts";

/**
 * Renders the `div` with the toast's description class.
 */
const Drawn = withContext("div", "description");

/**
 * Describes the props of the description: the props of a `div`.
 */
export type DescriptionProps = ComponentProps<typeof Drawn>;

/**
 * Renders the description with the machine's description props merged over the caller's.
 *
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function Description(props: DescriptionProps): ReactElement {
  const api = useToast();

  return <Drawn {...mergeProps(api.getDescriptionProps(), props)} />;
}
