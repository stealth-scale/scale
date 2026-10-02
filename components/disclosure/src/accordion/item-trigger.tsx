/**
 * Renders the button that opens and closes an item.
 *
 * @remarks
 *   The element is a `button`. The machine sets `aria-expanded`, `aria-controls` and `disabled`,
 *   and moves focus to the next trigger with ArrowDown, to the previous one with ArrowUp and to the
 *   first and last with Home and End, skipping disabled triggers.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#accordion/context.ts";
import { useAccordion } from "#accordion/machine.ts";
import { useItem } from "#accordion/state.ts";

/**
 * Renders the `button` with the accordion's item trigger class.
 */
const Pressed = withContext("button", "itemTrigger");

/**
 * Describes the props of the item trigger: the props of a `button`.
 */
export type ItemTriggerProps = ComponentProps<typeof Pressed>;

/**
 * Renders the trigger with the machine's trigger props merged over the caller's.
 *
 * @param props - The props of a `button`.
 * @returns The `button` element.
 */
export function ItemTrigger(props: ItemTriggerProps): ReactElement {
  const { api } = useAccordion();
  const { options } = useItem();

  return <Pressed {...mergeProps(api.getItemTriggerProps(options), props)} />;
}
