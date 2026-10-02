/**
 * Words the current page as text: "Page 12 of 24", "12 / 24" or "111–120 of 240".
 */

/**
 * Describes the items of the current page by index, from zero.
 */
export interface PageRange {
  /**
   * Index of the item after the page's last.
   */
  readonly end: number;

  /**
   * Index of the page's first item.
   */
  readonly start: number;
}

/**
 * Describes where the reader is among the pages, as the machine counts it.
 */
export interface PageDetails {
  /**
   * Number of items across every page.
   */
  readonly count: number;

  /**
   * Number of the current page, from one.
   */
  readonly page: number;

  /**
   * Indexes of the current page's first item and of the item after its last, from zero.
   */
  readonly pageRange: PageRange;

  /**
   * Number of pages.
   */
  readonly totalPages: number;
}

/**
 * Selects how the page text words the current page, or a function that words it.
 */
export type PageFormat = "compact" | "long" | "short" | ((details: PageDetails) => string);

/**
 * Returns the text for the current page in the format given.
 *
 * @remarks
 *   `compact` gives "Page 12 of 24", `short` "12 / 24" and `long` the range of items, "111–120 of
 *   240". A count of zero has no pages, which the formats word as "Page 0 of 0", "0 / 0" and "0–0
 *   of 0". A function receives the four details alone, whatever else the object passed in contains,
 *   and returns the words in any language.
 * @param details - Where the reader is among the pages, such as the machine's api.
 * @param format - The format, or the function that words the details.
 * @returns The text.
 */
export function worded(
  { count, page, pageRange, totalPages }: PageDetails,
  format: PageFormat,
): string {
  if (typeof format === "function") return format({ count, page, pageRange, totalPages });

  const shown = Math.min(page, totalPages);
  const first = count === 0 ? 0 : pageRange.start + 1;
  const words = {
    compact: `Page ${shown} of ${totalPages}`,
    long: `${first}–${pageRange.end} of ${count}`,
    short: `${shown} / ${totalPages}`,
  };

  return words[format];
}
