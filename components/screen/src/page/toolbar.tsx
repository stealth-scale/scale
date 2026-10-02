/**
 * Renders the band between the navigation and the body, with the controls that filter or search
 * the body.
 *
 * @remarks
 *   The band is a part of its own, not the top of the body, so it keeps the page's gutter and
 *   measure and can stick while the rows scroll under it. Put `Toolbar.Root` in it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `div` with the recipe's toolbar class.
 */
const Banded = withContext("div", "toolbar");

/**
 * Describes the props of the toolbar band: `sticky` and the props of a `div`.
 */
export interface ToolbarProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Renders the toolbar band, with `data-sticky` when it sticks.
 *
 * @param props - Whether it sticks, and the props of a `div`.
 * @returns The `div` element.
 */
export function Toolbar({ sticky, ...rest }: ToolbarProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
