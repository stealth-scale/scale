/**
 * Renders a card's title.
 *
 * @remarks
 *   The element is a `span`. The machine points the card's input `aria-labelledby` at it, so the
 *   accessible name of the radio is the title on screen.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#radio-card/context.ts";
import { useRadioGroup } from "#radio-group/machine.ts";
import { useItem } from "#radio-group/state.ts";

/**
 * Renders the `span` with the radio card's item text class.
 */
const Titled = withContext("span", "itemText");

/**
 * Describes the props of the title: the props of a `span`.
 */
export type ItemTextProps = ComponentProps<typeof Titled>;

/**
 * Renders the title with the machine's props for the card around it.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element the card's input is labelled by.
 */
export function ItemText(props: ItemTextProps): ReactElement {
  const api = useRadioGroup();
  const item = useItem();

  return <Titled {...mergeProps(api.getItemTextProps(item), props)} />;
}
