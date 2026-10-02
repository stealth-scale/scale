/**
 * Renders the dialog's description.
 *
 * @remarks
 *   The machine points the panel's `aria-describedby` at the description while it is rendered, so
 *   a screen reader reads it after the title.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#dialog/context.ts";
import { useDialog } from "#dialog/machine.ts";

/**
 * Renders the `p` with the dialog's description class.
 */
const Drawn = withContext("p", "description");

/**
 * Describes the props of the description: the props of a `p`.
 */
export type DescriptionProps = ComponentProps<typeof Drawn>;

/**
 * Renders the description with the machine's description props merged over the caller's.
 *
 * @param props - The props of a `p`.
 * @returns The `p` element.
 */
export function Description(props: DescriptionProps): ReactElement {
  const api = useDialog();

  return <Drawn {...mergeProps(api.getDescriptionProps(), props)} />;
}
