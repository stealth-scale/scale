/**
 * Renders the column beside the body, such as an activity trail, a panel of details or a list of
 * the page's headings.
 *
 * @remarks
 *   The element is `aside`, a complementary landmark. Name it with `aria-label`, because a screen
 *   reader announces an unnamed one as "complementary". From the `lg` breakpoint of the window, a
 *   page with an aside renders it beside the body, as wide as its content. Below it, `folds`
 *   decides: `under` stacks it under the body, and `hide` removes it, such as a list of headings
 *   the page's navigation replaces on a phone. `sticky` keeps it in view while the body scrolls,
 *   under the shell's sticky bars.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `aside` with the recipe's aside class.
 */
const Beside = withContext("aside", "aside");

/**
 * Behaviour of the aside below the `lg` breakpoint.
 */
export type AsideFold = "hide" | "under";

/**
 * Describes the props of the aside: how it folds, `sticky` and the props of an `aside`.
 */
export interface AsideProps extends ComponentProps<typeof Beside>, StickyProps {
  /**
   * Whether the aside stacks under the body or leaves the page below the `lg` breakpoint. It
   * stacks under the body by default.
   */
  readonly folds?: AsideFold | undefined;
}

/**
 * Renders the aside with `data-folds`, and `data-sticky` when it sticks.
 *
 * @param props - How it folds, whether it sticks, and the props of an `aside`.
 * @returns The `aside` element.
 */
export function Aside({ folds = "under", sticky, ...rest }: AsideProps): ReactElement {
  return <Beside {...rest} data-folds={folds} data-sticky={stuck(sticky)} />;
}
