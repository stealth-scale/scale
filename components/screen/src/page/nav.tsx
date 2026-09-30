/**
 * Renders the band under the header with the page's own navigation, such as its tabs.
 *
 * @remarks
 *   The element is `nav`. Name it with `aria-label`, because a screen has more than one navigation
 *   landmark and an unnamed one is announced without a name to tell it from the shell's. The band
 *   has the hairline the header would otherwise have, so a strip of tabs in it has one line under
 *   it. `when` renders it at one width of the page alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { useShown, type WhenProps } from "#page/state.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `nav` with the recipe's nav class.
 */
const Banded = withContext("nav", "nav");

/**
 * Describes the props of the navigation: `sticky`, `when` and the props of a `nav`.
 */
export interface NavProps extends ComponentProps<typeof Banded>, StickyProps, WhenProps {}

/**
 * Renders the navigation at the width `when` names, with `data-sticky` when it sticks.
 *
 * @param props - Whether it sticks, the width and the props of a `nav`.
 * @returns The `nav` element, or nothing at the other width.
 */
export function Nav({ sticky, when, ...rest }: NavProps): null | ReactElement {
  return useShown(when) ? <Banded {...rest} data-sticky={stuck(sticky)} /> : null;
}
