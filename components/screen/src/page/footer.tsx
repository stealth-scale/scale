/**
 * Renders the band at the end of the page.
 *
 * @remarks
 *   The element is `footer`, which is plain content inside a page, because the shell renders the
 *   one contentinfo landmark a screen has. The root is at least as tall as its container, so the
 *   footer of a short page renders at the container's end.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `footer` with the recipe's footer class.
 */
const Banded = withContext("footer", "footer");

/**
 * Describes the props of the footer: `sticky` and the props of a `footer`.
 */
export interface FooterProps extends ComponentProps<typeof Banded>, StickyProps {}

/**
 * Renders the footer, with `data-sticky` when it sticks to the bottom.
 *
 * @param props - Whether it sticks, and the props of a `footer`.
 * @returns The `footer` element.
 */
export function Footer({ sticky, ...rest }: FooterProps): ReactElement {
  return <Banded {...rest} data-sticky={stuck(sticky)} />;
}
