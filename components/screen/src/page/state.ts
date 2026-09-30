/**
 * Provides the page's size and measured width to its parts and to the sections in it.
 *
 * @remarks
 *   A section in a page reads its size from here, so one size on `Page.Root` sets every section.
 *   A part rendered at one width reads the page's measured width from here.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Size of a page.
 */
export type PageSize = "lg" | "md" | "sm";

/**
 * Width at which a part renders.
 */
export type PageWidth = "narrow" | "wide";

/**
 * Describes the state a page provides.
 */
export interface PageState {
  /**
   * Whether the page is narrower than the `sm` breakpoint.
   */
  narrow: boolean;

  /**
   * Size of the title, the description and the actions.
   */
  size: PageSize;
}

/**
 * Creates the context through which the root provides the page state.
 */
export const [PageProvider, usePage, useOptionalPage] = createRequiredContext<PageState>("Page");

/**
 * Button size of the page's actions per page size: the first on a wide page, the second on a
 * narrow one.
 */
const BUTTONS: Readonly<Record<PageSize, readonly [wide: PageSize, narrow: PageSize]>> = {
  lg: ["lg", "md"],
  md: ["md", "sm"],
  sm: ["sm", "sm"],
};

/**
 * Returns the button size of the page's actions.
 *
 * @remarks
 *   A narrow page renders its actions one size smaller, down to `sm`, so the title keeps its room
 *   on a phone.
 * @param state - The page's size and whether it is narrow.
 * @returns The size the actions and the menu's trigger render at.
 */
export function buttonSizeOf(state: PageState): PageSize {
  return BUTTONS[state.size][state.narrow ? 1 : 0];
}

/**
 * Describes the props of a part rendered at one width.
 */
export interface WhenProps {
  /**
   * Width at which the part renders. `narrow` renders it on a folded page alone, and `wide` on an
   * unfolded page alone, which swaps a full trail for a single link back. Without it, the part
   * renders at every width.
   */
  readonly when?: PageWidth | undefined;
}

/**
 * Returns whether a part rendered at one width renders at the page's current width.
 *
 * @remarks
 *   The width is the page's own measurement, so a part in a page beside an open sidebar swaps on
 *   the page's room.
 * @param when - The width at which the part renders, or nothing for every width.
 * @param narrow - Whether the page has folded.
 * @returns Whether the part renders.
 */
export function shown(when: PageWidth | undefined, narrow: boolean): boolean {
  return when === undefined || (when === "narrow") === narrow;
}

/**
 * Returns whether a part rendered at one width renders on the nearest page.
 *
 * @param when - The width at which the part renders, or nothing for every width.
 * @returns Whether the part renders.
 */
export function useShown(when: PageWidth | undefined): boolean {
  return shown(when, usePage().narrow);
}
