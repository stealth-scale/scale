/**
 * Renders the words that name the set of cards.
 *
 * @remarks
 *   The label reports itself to the root while it is mounted, and the root is named by it from
 *   then on. It spans every column of a horizontal set.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#radio-card/context.ts";
import { useRadioGroup } from "#radio-group/machine.ts";
import { useLabelled } from "#radio-group/state.ts";

/**
 * Renders the `span` with the radio card's label class.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of the label: the props of a `span`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's ID.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element the set is labelled by.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useRadioGroup();

  useLabelled();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
