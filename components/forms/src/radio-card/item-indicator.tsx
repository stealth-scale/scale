/**
 * Renders a card's circle.
 *
 * @remarks
 *   The element is a `span` the machine hides from assistive technology, because the card's
 *   `input` already reports the state. The recipe renders the dot of a checked circle, so the part
 *   needs no children, and the card renders the focus ring.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#radio-card/context.ts";
import { useRadioGroup } from "#radio-group/machine.ts";
import { useItem } from "#radio-group/state.ts";

/**
 * Renders the `span` with the radio card's item indicator class.
 */
const Circle = withContext("span", "itemIndicator");

/**
 * Describes the props of the circle: the props of a `span`.
 */
export type ItemIndicatorProps = ComponentProps<typeof Circle>;

/**
 * Renders the circle with the machine's control props for the card around it.
 *
 * @param props - Attributes of the `span` element, merged over the machine's.
 * @returns The `span` element.
 */
export function ItemIndicator(props: ItemIndicatorProps): ReactElement {
  const api = useRadioGroup();
  const item = useItem();

  return <Circle {...mergeProps(api.getItemControlProps(item), props)} />;
}
