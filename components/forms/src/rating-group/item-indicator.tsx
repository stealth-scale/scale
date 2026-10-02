/**
 * Renders the glyph of a rating item: an empty glyph and a filled one over it.
 *
 * @remarks
 *   The element is a `span` hidden from assistive technology, because the item is named. It renders
 *   its children twice, so the caller passes the glyph once, such as an icon: the empty glyph is in
 *   the border ink, and the filled glyph shows in the palette's solid on every item up to the
 *   value, clipped to its first half on a half item. The recipe reads the item's state from the
 *   item.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#rating-group/context.ts";

/**
 * Renders the `span` with the rating group's item indicator class.
 */
const Glyph = withContext("span", "itemIndicator");

/**
 * Renders the `span` with the rating group's empty glyph class.
 */
const Empty = withContext("span", "itemEmpty");

/**
 * Renders the `span` with the rating group's filled glyph class.
 */
const Filled = withContext("span", "itemFilled");

/**
 * Describes the props of the indicator: the glyph as children, and the props of a `span`.
 */
export type ItemIndicatorProps = ComponentProps<typeof Glyph>;

/**
 * Renders the indicator with both copies of the glyph.
 *
 * @param props - The glyph as children, and the props of the `span`.
 * @returns The `span` element.
 */
export function ItemIndicator({ children, ...rest }: ItemIndicatorProps): ReactElement {
  return (
    <Glyph aria-hidden {...rest}>
      <Empty>{children}</Empty>
      <Filled>{children}</Filled>
    </Glyph>
  );
}
