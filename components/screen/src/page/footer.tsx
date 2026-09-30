/**
 * Renders the band at the end of the page.
 *
 * @remarks
 *   The element is `footer`, which is plain content inside a page, because the shell renders the
 *   one contentinfo landmark a screen has. The root is at least as tall as its container, so the
 *   footer of a short page renders at the container's end. `when` renders it at one width of the
 *   page alone.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { useShown, type WhenProps } from "#page/state.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `footer` with the recipe's footer class.
 */
const Banded = withContext("footer", "footer");

/**
 * Describes the props of the footer: `sticky`, `when` and the props of a `footer`.
 */
export interface FooterProps extends ComponentProps<typeof Banded>, StickyProps, WhenProps {}

/**
 * Renders the footer at the width `when` names, with `data-sticky` when it sticks to the bottom.
 *
 * @param props - Whether it sticks, the width and the props of a `footer`.
 * @returns The `footer` element, or nothing at the other width.
 */
export function Footer({ sticky, when, ...rest }: FooterProps): null | ReactElement {
  return useShown(when) ? <Banded {...rest} data-sticky={stuck(sticky)} /> : null;
}
