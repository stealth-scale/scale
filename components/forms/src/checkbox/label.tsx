/**
 * Renders the checkbox's text.
 *
 * @remarks
 *   The element is a `span`, because the root is already the `label` and a label inside a label
 *   names nothing. The machine points the input's `aria-labelledby` at this part, so the accessible
 *   name is the text on screen.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Renders the `span` with the checkbox's label class.
 */
const Named = withContext("span", "label");

/**
 * Describes the props of the label: the props of a `span`.
 */
export type LabelProps = ComponentProps<typeof Named>;

/**
 * Renders the text with the machine's label props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element the input is labelled by.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useCheckbox();

  return <Named {...mergeProps(api.getLabelProps(), props)} />;
}
