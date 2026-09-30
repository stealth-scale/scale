/**
 * Renders an option's words.
 *
 * @remarks
 *   The element is a `span`. The machine points the item's input `aria-labelledby` at it, so the
 *   accessible name of the radio is the text on screen. Words wider than the item end in an
 *   ellipsis. An iconic group hides the words visually and keeps them as the name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useRadioGroup } from "#radio-group/machine.ts";
import { useItem } from "#radio-group/state.ts";
import { withContext } from "#segment-group/context.ts";

/**
 * Renders the `span` with the segment group's item text class.
 */
const Words = withContext("span", "itemText");

/**
 * Describes the props of the words: the props of a `span`.
 */
export type ItemTextProps = ComponentProps<typeof Words>;

/**
 * Renders the words with the machine's props for the item around them.
 *
 * @param props - Attributes and children of the `span` element, merged over the machine's.
 * @returns The `span` element the item's input is labelled by.
 */
export function ItemText(props: ItemTextProps): ReactElement {
  const api = useRadioGroup();
  const item = useItem();

  return <Words {...mergeProps(api.getItemTextProps(item), props)} />;
}
