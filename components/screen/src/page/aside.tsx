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
 *   under the shell's sticky bars. A sticky aside renders its content in the primitives package's
 *   scroll area. Beside the body the aside is at most as tall as the room the area that scrolls
 *   the page leaves under the sticky bands, and the scroll area fills it, so its end remains
 *   reachable. The scroll area's viewport takes the aside's name.
 */

import { type ComponentProps, type ReactElement, useState } from "react";

import { ScrollArea } from "@stealthscale/component-primitives";
import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#page/context.ts";
import { SCROLLPORT } from "#page/recipe.ts";
import { useScrollport } from "#page/scrollport.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Renders the `aside` with the recipe's aside class.
 */
const Beside = withContext("aside", "aside");

/**
 * Renders the scroll area's root with the recipe's class, which fills a sticky aside.
 */
const Scroller = withContext(ScrollArea.Root, "asideScroller");

/**
 * Renders the scroll area's content with the recipe's class, which leaves the focus ring room.
 */
const Padded = withContext(ScrollArea.Content, "asideContent");

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
 * Renders the aside with `data-folds`, and, when it sticks, `data-sticky` and its content in a
 * scroll area.
 *
 * @param props - How it folds, whether it sticks, and the props of an `aside`.
 * @returns The `aside` element.
 */
export function Aside({ children, folds = "under", sticky, ...rest }: AsideProps): ReactElement {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const named = omitUndefined({
    "aria-label": rest["aria-label"],
    "aria-labelledby": rest["aria-labelledby"],
  });

  useScrollport(scroller === null ? null : scroller.parentElement, SCROLLPORT);

  return (
    <Beside {...rest} data-folds={folds} data-sticky={stuck(sticky)}>
      {sticky === true ? (
        <Scroller ref={setScroller}>
          <ScrollArea.Viewport {...named}>
            <Padded>{children}</Padded>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </Scroller>
      ) : (
        children
      )}
    </Beside>
  );
}
