/**
 * Renders the icon of a block quotation.
 *
 * @remarks
 *   The part binds the package's `Icon` to the icon slot, so the icon recipe sets the size and the
 *   slot sets the colour of the look. Without children it renders the library's quote mark in a
 *   24-unit box. Children replace the mark, such as a lucide icon with `viewBox="0 0 24 24"`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#blockquote/context.ts";
import { Icon as Artwork } from "#icon/icon.ts";

/**
 * Renders the package's `Icon` with the icon slot's classes.
 */
const Slot = withContext(Artwork, "icon");

/**
 * Path of the quote mark in a 24-unit box: two filled marks with square tops.
 */
const MARK = "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z";

/**
 * Describes the props of Blockquote.Icon: the icon recipe's variants and the props of an `svg`
 * element.
 */
export type IconProps = ComponentProps<typeof Slot>;

/**
 * Renders the quote mark, or the children in its place.
 *
 * @remarks
 *   The `viewBox` defaults to the mark's 24-unit box, and a `viewBox` passed by the caller takes
 *   precedence.
 */
export function Icon({ children, ...props }: IconProps): ReactElement {
  return (
    <Slot viewBox="0 0 24 24" {...props}>
      {children ?? <path d={MARK} />}
    </Slot>
  );
}
