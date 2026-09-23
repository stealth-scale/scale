/**
 * Renders the list row of one heading.
 *
 * @remarks
 *   The caller passes the heading as `item`. The machine sets `--depth`, `data-depth` and
 *   `data-active` from it, and the recipe indents the row by the depth.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#toc/context.ts";
import { type TocItem, useToc } from "#toc/machine.ts";

/**
 * List item with the item slot classes.
 */
const Styled = withContext("li", "item");

/**
 * Describes the props of Toc.Item: the heading and the props of a list item element.
 */
export interface ItemProps extends ComponentProps<typeof Styled> {
  /**
   * Heading of the row: its element ID as `value` and its level as `depth`.
   */
  readonly item: TocItem;
}

/**
 * Renders a list item with the depth and active state of its heading.
 */
export function Item({ item, ...rest }: ItemProps): ReactElement {
  const api = useToc();

  return <Styled {...mergeProps(api.getItemProps({ item }), rest)} />;
}
