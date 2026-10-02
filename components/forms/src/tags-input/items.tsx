/**
 * Renders one item per tag through a render function.
 *
 * @remarks
 *   The function receives each tag and its position, in the order the tags were added, and
 *   returns the item for that tag, usually a `TagsInput.Item`. Items renders no element of its own,
 *   so the items it returns lay out in the control beside the input.
 */

import { Fragment, type ReactNode } from "react";

import { useTagsInput } from "#tags-input/machine.ts";

/**
 * Describes the props of the items: the render function.
 */
export interface ItemsProps {
  /**
   * Render function called with each tag and its position.
   */
  readonly children: (value: string, index: number) => ReactNode;
}

/**
 * Calls the render function once per tag.
 *
 * @param props - The render function, as `children`.
 * @returns The items the render function returns, one per tag.
 */
export function Items({ children }: ItemsProps): ReactNode {
  return useTagsInput().value.map((value, index) => (
    // eslint-disable-next-line react/no-array-index-key -- a tag repeats under allowDuplicates, so its position is part of its identity
    <Fragment key={`${index}:${value}`}>{children(value, index)}</Fragment>
  ));
}
