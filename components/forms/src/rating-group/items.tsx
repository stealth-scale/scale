/**
 * Renders one item per value through a render function.
 *
 * @remarks
 *   The function receives each value from 1 to the root's `count` and returns the item for it,
 *   usually a `RatingGroup.Item`. Items renders no element of its own, so the items it returns lay
 *   out in the control.
 */

import { Fragment, type ReactNode } from "react";

import { useRatingGroup } from "#rating-group/machine.ts";

/**
 * Describes the props of the items: the render function.
 */
export interface ItemsProps {
  /**
   * Render function called with each value, from 1 to `count`.
   */
  readonly children: (index: number) => ReactNode;
}

/**
 * Calls the render function once per value.
 *
 * @param props - The render function, as `children`.
 * @returns The items the render function returns, one per value.
 */
export function Items({ children }: ItemsProps): ReactNode {
  return useRatingGroup().items.map((index) => <Fragment key={index}>{children(index)}</Fragment>);
}
