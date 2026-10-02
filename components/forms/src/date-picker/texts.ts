/**
 * Returns what the parts show and submit: the visible range as text, and the dates the root
 * renders a hidden input for.
 */

import { type DatePickerApi } from "#date-picker/machine.ts";

/**
 * Returns the visible range of the view in force as text: `September 2026`, `2026`, or
 * `2020 – 2029`, with the end only where it differs from the start.
 *
 * @param api - The machine's api, whose visible range the text reads.
 * @returns The range, such as `September 2026`.
 */
export function visibleText(api: Pick<DatePickerApi, "visibleRangeText">): string {
  const { end, start } = api.visibleRangeText;

  return [...new Set([start, end])].filter(Boolean).join(" – ");
}

/**
 * Returns the indexes of the dates the root renders a hidden input for: one for a single date, two
 * for a range, and one per date for multiple dates, at least one.
 *
 * @param api - The machine's api, whose selection mode and dates decide the count.
 * @returns The index of each date, from 0.
 */
export function submittedIndexes(api: Pick<DatePickerApi, "selectionMode" | "value">): number[] {
  if (api.selectionMode === "range") return [0, 1];
  if (api.selectionMode === "single") return [0];

  return Array.from({ length: Math.max(1, api.value.length) }, (_, index) => index);
}
