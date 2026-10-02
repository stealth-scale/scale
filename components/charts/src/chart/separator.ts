/**
 * Returns the separator a locale writes between two items of a list, which joins words a chart
 * writes as one line, such as a point's name and its quadrant.
 */

/**
 * Returns the separator a locale writes between the first two items of a list: ", " in English and
 * German, "、" in Japanese and Chinese.
 *
 * @remarks
 *   The separator between the last two items of a list is often a word, such as "and", so the
 *   separator is the second part of a list of three items.
 * @param locale - The locale the chart writes in.
 */
export function separatorOf(locale: string): string {
  return new Intl.ListFormat(locale)
    .formatToParts(["a", "b", "c"])
    .slice(1, 2)
    .map((part) => part.value)
    .join("");
}
