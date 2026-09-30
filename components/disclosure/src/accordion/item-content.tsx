/**
 * Renders the region an item's trigger shows and hides.
 *
 * @remarks
 *   The element is a `div` in the `region` role, named by its trigger. The collapsible machine sets
 *   `hidden`, `data-state` and the measured height, so the content animates open and closed and a
 *   control inside a closed item leaves the tab order. An item that starts open does not animate
 *   in. Happy-dom runs no animation frames, so the specs read the closed state and `hidden`, not
 *   the open state.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#accordion/context.ts";
import { useAccordion } from "#accordion/machine.ts";
import { useItem } from "#accordion/state.ts";

/**
 * Renders the `div` with the accordion's item content class.
 */
const Shown = withContext("div", "itemContent");

/**
 * Describes the props of the item content: the props of a `div`.
 */
export type ItemContentProps = ComponentProps<typeof Shown>;

/**
 * Renders the content with the accordion's region props and the collapsible's visibility merged
 * over the caller's.
 *
 * @remarks
 *   The accordion's `hidden` and `data-state` are passed as `undefined`, which the merge skips, so
 *   the collapsible's values apply and the content is visible while it animates closed.
 * @param props - The props of a `div`.
 * @returns The `div` element.
 */
export function ItemContent(props: ItemContentProps): ReactElement {
  const { api } = useAccordion();
  const { collapsible, options } = useItem();
  const region = {
    ...api.getItemContentProps(options),
    "data-state": undefined,
    hidden: undefined,
  };

  return <Shown {...mergeProps(collapsible.getContentProps(), region, props)} />;
}
