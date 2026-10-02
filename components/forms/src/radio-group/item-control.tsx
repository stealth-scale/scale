/**
 * Renders an option's circle.
 *
 * @remarks
 *   The element is a `span`, because the item is a `label` and a label contains only phrasing
 *   content. The machine hides it from assistive technology, because the item's `input` already
 *   reports the state, and sets `data-state` and the other state attributes the recipe reads on
 *   it. The recipe renders the dot of a checked circle, so the part needs no children.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#radio-group/context.ts";
import { useRadioGroup } from "#radio-group/machine.ts";
import { useItem } from "#radio-group/state.ts";

/**
 * Renders the `span` with the radio group's item control class.
 */
const Circle = withContext("span", "itemControl");

/**
 * Describes the props of the circle: the props of a `span`.
 */
export type ItemControlProps = ComponentProps<typeof Circle>;

/**
 * Renders the circle with the machine's props for the item around it.
 *
 * @param props - Attributes of the `span` element, merged over the machine's.
 * @returns The `span` element.
 */
export function ItemControl(props: ItemControlProps): ReactElement {
  const api = useRadioGroup();
  const item = useItem();

  return <Circle {...mergeProps(api.getItemControlProps(item), props)} />;
}
