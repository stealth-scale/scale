/**
 * Renders the band under the header with the page's own navigation, such as its tabs.
 *
 * @remarks
 *   The element is `nav`. Name it with `aria-label`, because a screen has more than one navigation
 *   landmark and an unnamed one is announced without a name to tell it from the shell's. The band
 *   has the hairline the header would otherwise have, so a strip of tabs in it has one line under
 *   it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `nav` with the recipe's nav class.
 */
const Banded = withContext("nav", "nav");

/**
 * Describes the props of the navigation: `sticky` and the props of a `nav`.
 */
export interface NavProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Renders the navigation, with `data-sticky` when it sticks.
 *
 * @param props - Whether it sticks, and the props of a `nav`.
 * @returns The `nav` element.
 */
export function Nav({ sticky, ...rest }: NavProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
