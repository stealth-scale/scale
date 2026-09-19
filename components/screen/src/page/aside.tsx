/**
 * Draws the column beside the body: an activity trail, a panel of metadata, a list of the
 * headings on the page, what relates to the thing shown without being it.
 *
 * @remarks
 *   The element is `aside`, which is a complementary landmark. Name it, because a screen reader
 *   announces an unnamed one as `complementary` with nothing to say what it holds.
 *   It is a peer of the body rather than something inside it. A page holding one lays the two
 *   side by side from the large breakpoint up, the aside as wide as what it holds, and stacks the
 *   aside under the body below it. `folds` says what happens below: `under` stacks it, and `hide`
 *   drops it, for a list of headings the page's own navigation stands in for on a phone. `sticky`
 *   keeps it in view as the body scrolls past, under the shell's pinned bars.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#page/context.ts";
import { type StickyProps, stuck } from "#page/sticky.ts";

/**
 * Draws the column at the room the page states.
 */
const Beside = withContext("aside", "aside");

/**
 * Lists what an aside does below the large breakpoint, where the page is too narrow to hold it
 * beside the body.
 */
export type AsideFold = "hide" | "under";

/**
 * Describes what the aside takes.
 */
export interface AsideProps extends ComponentProps<typeof Beside>, StickyProps {
  /**
   * Whether the aside stacks under the body or leaves the page below the large breakpoint. It
   * stacks under the body by default.
   */
  readonly folds?: AsideFold | undefined;
}

/**
 * Stands beside the body, and under it where the page is narrow.
 *
 * @param props - How it folds, whether it stays put, and everything a styled aside takes.
 * @returns The column, carrying how it folds and whether it sticks.
 */
export function Aside({ folds = "under", sticky, ...rest }: AsideProps): ReactElement {
  return <Beside {...rest} data-folds={folds} data-sticky={stuck(sticky)} />;
}
