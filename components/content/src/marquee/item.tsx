/**
 * Renders one item of the marquee.
 *
 * @remarks
 *   The machine spaces the items by half the recipe's `gap` on each side, inline, so the space
 *   between two items is the same inside a copy and across the join of two copies.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#marquee/context.ts";
import { useMarquee } from "#marquee/machine.ts";

/**
 * Renders the `div` with the marquee's item class.
 */
const Drawn = withContext("div", "item");

/**
 * Describes the props of an item: the props of a `div`.
 */
export type ItemProps = ComponentProps<typeof Drawn>;

/**
 * Renders the item with the machine's item props merged under the caller's.
 *
 * @param props - The item's content and the props of a `div`.
 * @returns The `div` element.
 */
export function Item(props: ItemProps): ReactElement {
  const { api } = useMarquee();

  return <Drawn {...mergeProps(api.getItemProps(), props)} />;
}
