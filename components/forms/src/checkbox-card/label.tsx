/**
 * Renders a checkbox card's title.
 *
 * @remarks
 *   The element is a `span`, because the card is already the `label`. The machine points the
 *   card's input `aria-labelledby` at it, so the accessible name is the title on screen.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#checkbox-card/context.ts";
import { useCheckbox } from "#checkbox/machine.ts";

/**
 * Renders the `span` with the checkbox card's label class.
 */
const Titled = withContext("span", "label");

/**
 * Describes the props of the title: the props of a `span`.
 */
export type LabelProps = ComponentProps<typeof Titled>;

/**
 * Renders the title with the machine's label props.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element the card's input is labelled by.
 */
export function Label(props: LabelProps): ReactElement {
  const api = useCheckbox();

  return <Titled {...mergeProps(api.getLabelProps(), props)} />;
}
