/**
 * Renders the text that names the switch.
 *
 * @remarks
 *   The element is a `span`, because the root is the `label` and a label inside a label names
 *   nothing. The machine points the input's `aria-labelledby` at it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#switch/context.ts";
import { useSwitch } from "#switch/machine.ts";

/**
 * Renders the `span` with the switch's label class.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of the label: the props of a `span`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the label with the machine's label props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element with the machine's `id` and state attributes.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useSwitch();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
