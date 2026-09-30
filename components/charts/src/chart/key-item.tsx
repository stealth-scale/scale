/**
 * Renders one entry of a chart's key: a part's glyph and its name.
 *
 * @remarks
 *   The glyph is the caller's own `svg` of the part, so it matches the marks. It is hidden from
 *   assistive technology, because the name beside it is what a screen reader reads.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { withContext } from "#chart/context.ts";

/**
 * Renders the `li` with the chart's key item class.
 */
const Item = withContext("li", "keyItem");

/**
 * Renders the `span` that sizes a glyph.
 */
const Glyph = withContext("span", "glyph");

/**
 * Describes the props of a key's entry: the glyph, the name and the props of an `li`.
 */
export interface KeyItemProps extends ComponentProps<typeof Item> {
  /**
   * Picture of the part, an `svg` the recipe sizes to the text.
   */
  readonly glyph: ReactNode;
}

/**
 * Renders the glyph and the name.
 *
 * @param props - The glyph, the name and the props of an `li`.
 */
export function KeyItem({ children, glyph, ...props }: KeyItemProps): ReactElement {
  return (
    <Item {...props}>
      <Glyph aria-hidden>{glyph}</Glyph>
      {children}
    </Item>
  );
}
