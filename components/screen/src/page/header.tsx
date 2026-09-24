/**
 * Renders the band with the title and the parts that name or act on the page.
 *
 * @remarks
 *   The element is `header`, which is plain content inside a page, because the shell renders the
 *   one banner landmark a screen has. It is a grid, so its parts are siblings placed by area name
 *   and a part left out takes no room.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `header` with the recipe's header class.
 */
const Banded = withContext("header", "header");

/**
 * Describes the props of the header: `sticky` and the props of a `header`.
 */
export interface HeaderProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Renders the header, with `data-sticky` when it sticks.
 *
 * @param props - Whether it sticks, and the props of a `header`.
 * @returns The `header` element.
 */
export function Header({ sticky, ...rest }: HeaderProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
