/**
 * Renders a button for every page the machine shows, a mark for every run of pages it leaves out,
 * and the summary that replaces them while they do not fit the row.
 *
 * @remarks
 *   The machine shows the first and the last page, the current page and `siblingCount` pages on
 *   each side of it, and one mark for each run between them. `boundaryCount` sets how many pages
 *   each end keeps. The summary is an `output`, hidden until the root marks the row
 *   `data-crowded`, so a screen reader reads the new page after a press only while the summary
 *   shows.
 */

import { type ReactElement } from "react";

import { type Pages } from "@zag-js/pagination";

import { withContext } from "#pagination/context.ts";
import { Ellipsis } from "#pagination/ellipsis.tsx";
import { Item } from "#pagination/item.tsx";
import { usePagination } from "#pagination/machine.ts";
import { type PageFormat, worded } from "#pagination/wording.ts";

/**
 * Renders the `output` with the pagination's summary class.
 */
const Summary = withContext("output", "summary");

/**
 * Describes the props of the items: the words that name a page and the words of the summary.
 */
export interface ItemsProps {
  /**
   * Returns the accessible name of a page, "Page N" unless the caller passes another function.
   */
  readonly label?: ((page: number) => string) | undefined;

  /**
   * Format of the summary that replaces the pages while they do not fit the row, `compact`
   * ("Page 12 of 24") unless the caller passes another.
   */
  readonly summary?: PageFormat | undefined;
}

/**
 * Pairs every entry of the machine's list with a key: the page's number, or for a mark the number
 * of the page before it, because the list always opens on a page.
 *
 * @param pages - The machine's list of pages and marks.
 * @returns Each entry with its key, in order.
 */
function keyed(pages: Pages): Array<readonly [string, Pages[number]]> {
  let before = 0;

  return pages.map((page) => {
    if (page.type === "ellipsis") return [`after-${before}`, page] as const;

    before = page.value;

    return [`page-${page.value}`, page] as const;
  });
}

/**
 * Renders the pages, the marks between them and the summary.
 *
 * @param props - The function that names a page and the summary's format.
 * @returns The items in the machine's order, then the summary.
 */
export function Items({ label, summary = "compact" }: ItemsProps): ReactElement {
  const { api } = usePagination();

  return (
    <>
      {keyed(api.pages).map(([key, page], index) =>
        page.type === "page" ? (
          <Item key={key} label={label?.(page.value)} value={page.value} />
        ) : (
          <Ellipsis index={index} key={key} />
        ),
      )}
      <Summary>{worded(api, summary)}</Summary>
    </>
  );
}
