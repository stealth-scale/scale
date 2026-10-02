/**
 * Renders the mark inside a trigger that turns half a revolution while the item is open.
 *
 * @remarks
 *   The caller passes the glyph, and the recipe sizes it, turns it and places it at the trigger's
 *   end. The machine sets `aria-hidden`, because the trigger reports its state with `aria-expanded`
 *   and a mark inside a button joins the button's name.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#accordion/context.ts";
import { useAccordion } from "#accordion/machine.ts";
import { useItem } from "#accordion/state.ts";

/**
 * Renders the `span` with the accordion's item indicator class.
 */
const Turned = withContext("span", "itemIndicator");

/**
 * Describes the props of the item indicator: the props of a `span`.
 */
export type ItemIndicatorProps = ComponentProps<typeof Turned>;

/**
 * Renders the indicator with the machine's indicator props merged over the caller's.
 *
 * @param props - The props of a `span`.
 * @returns The `span` element.
 */
export function ItemIndicator(props: ItemIndicatorProps): ReactElement {
  const { api } = useAccordion();
  const { options } = useItem();

  return <Turned {...mergeProps(api.getItemIndicatorProps(options), props)} />;
}
